import os
import glob
from typing import List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import logging
import requests

from model_utils import load_embedding_model, embed_texts, cosine_similarity, persist_embeddings, load_persisted_embeddings

from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline, AutoConfig

# logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("reader_agent")

app = FastAPI(title="Reader Agent (NELIA - Reader)")

DOC_FOLDER = "data"
DOC_CHUNKS = []
DOC_CHUNK_EMBS = None
EMB_MODEL = None

GEN_MODEL_NAME = os.environ.get("GEN_MODEL_NAME", "google/flan-t5-small")
GEN_MAX_INPUT_TOKENS = int(os.environ.get("GEN_MAX_INPUT_TOKENS", 512))  # safety default

# ---- load models ----
log.info("Carregando modelos de embeddings...")
EMB_MODEL = load_embedding_model()  # SentenceTransformer

log.info("Carregando gerador e tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(GEN_MODEL_NAME)
gen_model = AutoModelForSeq2SeqLM.from_pretrained(GEN_MODEL_NAME)
# If you have GPU, set device=0 in pipeline. Here device=-1 (cpu).
generator = pipeline("text2text-generation", model=gen_model, tokenizer=tokenizer, device=-1)

# ---- helpers ----
def load_documents_and_index(persist_path="embeds.npy"):
    """
    Load .txt files from DOC_FOLDER, split in paragraphs, embed (or load persisted embeddings).
    """
    global DOC_CHUNKS, DOC_CHUNK_EMBS
    DOC_CHUNKS = []
    file_paths = sorted(glob.glob(os.path.join(DOC_FOLDER, "*.txt")))
    for fp in file_paths:
        with open(fp, "r", encoding="utf-8") as f:
            content = f.read().strip()
            # chunk strategy: split by double newline, fallback to whole file
            paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()] or [content]
            for i, p in enumerate(paragraphs):
                DOC_CHUNKS.append({"text": p, "meta": {"source": os.path.basename(fp), "chunk_id": i}})
    texts = [c["text"] for c in DOC_CHUNKS]
    if not texts:
        DOC_CHUNK_EMBS = np.array([])
        return

    # try loading persisted embeddings (optional)
    loaded = load_persisted_embeddings(persist_path)
    if loaded is not None and loaded.shape[0] == len(texts):
        log.info("Usando embeddings persistidos.")
        DOC_CHUNK_EMBS = loaded
    else:
        log.info("Gerando embeddings para %d chunks...", len(texts))
        DOC_CHUNK_EMBS = embed_texts(EMB_MODEL, texts)
        persist_embeddings(DOC_CHUNK_EMBS, persist_path)

def build_prompt(question: str, retrieved: List[dict], max_input_tokens=GEN_MAX_INPUT_TOKENS):
    """
    Constrói prompt contendo contextos truncados para caber no limite do gerador.
    Usa tokenizer to count tokens and truncates chunks if necessary.
    """
    header = "Use as informações abaixo para responder a pergunta.\n\nContexto:\n"
    footer = f"\n\nPergunta: {question}\nResposta:"
    # Start with header+footer tokens
    header_tokens = len(tokenizer(header)["input_ids"])
    footer_tokens = len(tokenizer(footer)["input_ids"])
    available = max_input_tokens - header_tokens - footer_tokens
    if available <= 0:
        # fallback – prompt somente com pergunta curta
        return f"Pergunta: {question}\nResposta:"

    # Add chunks until tokens used up
    parts = []
    used_tokens = 0
    for r in retrieved:
        chunk_text = f"[{r['meta']['source']}#{r['meta']['chunk_id']}]: {r['text']}"
        tok_len = len(tokenizer(chunk_text)["input_ids"])
        if used_tokens + tok_len <= available:
            parts.append(chunk_text)
            used_tokens += tok_len
        else:
            # try to truncate chunk_text to fit remaining tokens
            rem = available - used_tokens
            if rem <= 10:
                break
            # truncate by characters conservatively: reduce to ~70% of remaining tokens in chars
            # safer approach: progressively reduce by sentences until fit
            sentences = chunk_text.split(". ")
            shortened = ""
            for s in sentences:
                cand = (shortened + (". " if shortened else "") + s).strip()
                if len(tokenizer(cand)["input_ids"]) > rem:
                    break
                shortened = cand
            if shortened:
                parts.append(shortened + ("." if not shortened.endswith(".") else ""))
                used_tokens += len(tokenizer(shortened)["input_ids"])
            else:
                # cannot fit any more
                break

    context = "\n\n".join(parts)
    return f"{header}{context}{footer}"



def call_ollama(prompt: str, model="mistral"):
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    r = requests.post("http://host.docker.internal:11434/api/generate", json=payload)
    r.raise_for_status()
    return r.json().get("response", "")


# ---- init index ----
load_documents_and_index()
log.info("Indexed %d chunks", len(DOC_CHUNKS))

# ---- API models ----
class QueryIn(BaseModel):
    question: str
    top_k: int = 3

class AnswerOut(BaseModel):
    answer: str
    sources: List[dict] = []

# ---- endpoints ----
@app.get("/health")
def health():
    return {"status": "ok", "chunks": len(DOC_CHUNKS)}

@app.post("/query", response_model=AnswerOut)
def query(q: QueryIn):
    if DOC_CHUNK_EMBS is None or len(DOC_CHUNK_EMBS) == 0:
    # fallback direto: usa LLM do Ollama
        ollama_answer = call_ollama(question)
        return {"answer": ollama_answer, "sources": []}

    # sanity trim question: avoid extremely long inputs
    question = q.question.strip()
    MAX_QUESTION_CHARS = 5000
    if len(question) > MAX_QUESTION_CHARS:
        question = question[:MAX_QUESTION_CHARS]
        log.warning("Pergunta truncada por excesso de tamanho.")

    # embed question with try/except
    try:
        q_emb = EMB_MODEL.encode([question], convert_to_numpy=True)
    except Exception as e:
        log.exception("Erro ao gerar embedding da questão")
        raise HTTPException(status_code=500, detail=f"Erro embedding: {e}")

    sims = cosine_similarity(q_emb, DOC_CHUNK_EMBS)[0]
    topk_idx = sims.argsort()[::-1][:q.top_k]
    retrieved = [DOC_CHUNKS[i] for i in topk_idx]
    max_sim = float(sims[topk_idx[0]]) if len(sims) else 0.0
    log.info("Max similarity: %.4f", max_sim)

    # if very low similarity, return fallback (don't hallucinate)
    SIM_THRESHOLD = float(os.environ.get("SIM_THRESHOLD", 0.20))
    if max_sim < SIM_THRESHOLD:
    # Fallback: chamar Ollama (modelo sem documentos)
        ollama_answer = call_ollama(question)
        return {"answer": ollama_answer, "sources": []}

    # build prompt safely (token-limited)
    prompt = build_prompt(question, retrieved, max_input_tokens=GEN_MAX_INPUT_TOKENS)

    # generate with try/except and size safety
    try:
        gen = generator(prompt, max_length=256, do_sample=False)[0]
        # pipeline returns 'generated_text' or 'text' depending on version; handle both
        gen_text = gen.get("generated_text") or gen.get("text") or str(gen)
    except Exception as e:
        log.exception("Erro ao gerar resposta")
        raise HTTPException(status_code=500, detail=f"Erro na geração: {e}")

    sources = [{"source": r["meta"]["source"], "chunk_id": r["meta"]["chunk_id"], "snippet": (r["text"][:300] + ("..." if len(r["text"])>300 else ""))} for r in retrieved]
    return {"answer": gen_text.strip(), "sources": sources}

@app.post("/reload")
def reload_docs():
    load_documents_and_index()
    return {"status": "reloaded", "chunks": len(DOC_CHUNKS)}
