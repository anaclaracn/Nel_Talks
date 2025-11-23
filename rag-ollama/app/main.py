from fastapi import FastAPI
from rag import answer

app = FastAPI(title="RAG com Ollama Externo")


@app.get("/")
def root():
    return {"status": "ok", "message": "RAG usando Ollama da máquina host!"}


@app.get("/ask")
def ask(query: str):
    response = answer(query)
    return {"answer": response}
