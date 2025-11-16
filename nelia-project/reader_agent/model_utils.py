# reader_agent/model_utils.py
import os
import numpy as np
from sentence_transformers import SentenceTransformer

EMB_MODEL_NAME = "all-MiniLM-L6-v2"

def load_embedding_model():
    model = SentenceTransformer(EMB_MODEL_NAME)
    return model

def embed_texts(model, texts):
    embs = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    return embs

def cosine_similarity(a, b):
    a_norm = a / (np.linalg.norm(a, axis=1, keepdims=True) + 1e-10)
    b_norm = b / (np.linalg.norm(b, axis=1, keepdims=True) + 1e-10)
    return np.dot(a_norm, b_norm.T)

def persist_embeddings(embs, path="embeds.npy"):
    try:
        np.save(path, embs)
    except Exception:
        pass

def load_persisted_embeddings(path="embeds.npy"):
    if os.path.exists(path):
        try:
            return np.load(path)
        except Exception:
            return None
    return None
