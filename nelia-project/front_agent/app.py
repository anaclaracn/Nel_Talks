from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os

app = FastAPI(title="Front Agent (NELIA Gateway Simples)")

READER_URL = os.environ.get("READER_URL", "http://reader_agent:8001/query")

class QueryIn(BaseModel):
    question: str

class QueryOut(BaseModel):
    answer: str
    sources: list

# O método OPTIONS é usado pelo navegador para verificar permissões de CORS
@app.options("/onboarding/query")
@app.options("/query") # Adicione se houver rotas diretas para /query
def options_handler():
    return {"status": "ok"} # Retorna um status de sucesso para o preflight

@app.get("/health")
def health():
    return {"status": "ok", "reader_url": READER_URL}

# front_agent/app.py (apenas a função query ligeiramente modificada)
@app.post("/onboarding/query", response_model=QueryOut)
def query(q: QueryIn):
    payload = {"question": q.question.strip(), "top_k": 3}
    try:
        r = requests.post(READER_URL, json=payload, timeout=30)  # timeout maior
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao contactar reader agent: {e}")
    if r.status_code != 200:
        # tenta devolver mensagem legível do backend
        detail = r.text
        try:
            detail = r.json()
        except Exception:
            pass
        raise HTTPException(status_code=502, detail=detail)
    j = r.json()
    return {"answer": j.get("answer",""), "sources": j.get("sources", [])}
