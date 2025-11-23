import os
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from rag import save_vectorstore


def load_pdfs(pdf_dir="./data/docs"):
    docs = []
    for file in os.listdir(pdf_dir):
        if file.lower().endswith(".pdf"):
            print(f"Carregando: {file}")
            reader = PdfReader(os.path.join(pdf_dir, file))
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""

            docs.append(Document(page_content=text, metadata={"source": file}))
    return docs


def ingest():
    raw_docs = load_pdfs()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(raw_docs)
    save_vectorstore(chunks)
    print("Vectorstore criado com sucesso!")


if __name__ == "__main__":
    ingest()
