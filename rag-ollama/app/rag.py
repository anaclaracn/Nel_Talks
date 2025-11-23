import os
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_ollama import ChatOllama
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document


EMBED_MODEL = "nomic-embed-text"
LLM_MODEL = "mistral"

def ollama_url():
    return os.getenv("OLLAMA_HOST", "http://host.docker.internal:11434")

def build_embeddings():
    return OllamaEmbeddings(
        model=EMBED_MODEL,
        base_url=ollama_url(),
    )


def load_vectorstore():
    embeddings = build_embeddings()
    return FAISS.load_local(
        "vectorstore",
        embeddings,
        allow_dangerous_deserialization=True
    )


def save_vectorstore(docs):
    embeddings = build_embeddings()
    vectorstore = FAISS.from_documents(docs, embeddings)
    vectorstore.save_local("vectorstore")


def build_llm():
    return ChatOllama(
        model=LLM_MODEL,
        base_url=ollama_url()
    )


def answer(query: str):
    vectorstore = load_vectorstore()
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

    context_docs = retriever.invoke(query)
    context = "\n\n".join([doc.page_content for doc in context_docs])

    llm = build_llm()

    prompt = f"""
Você é um assistente especializado.
Responda com base **apenas nos documentos fornecidos**.

Contexto:
{context}

Pergunta: {query}

Resposta:
"""

    response = llm.invoke(prompt)
    return response

