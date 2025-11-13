// src/routes/gemini.js
import express from 'express';
import { callAPI } from '../utils/fetchHelper.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

// Fluxo: Gateway → Gemini → Nélia (decide se vai pro RAG)
router.post('/process', async (req, res) => {
  try {
    const { prompt } = req.body;

    // 1. Chama o Gemini
    const geminiResponse = await callAPI(`${process.env.GEMINI_URL}/process`, { prompt });

    // 2. Se o Gemini classificou como dúvida → manda pro Nélia
    if (geminiResponse.classification === 'duvida') {
      const neliaResponse = await callAPI(`${process.env.NELIA_SERVICE_URL}/analyze`, { message: geminiResponse.text });
      return res.json({ origin: 'RAG', response: neliaResponse });
    }

    // 3. Caso contrário → devolve direto pro front
    return res.json({ origin: 'Gemini', response: geminiResponse.text });

  } catch (error) {
        console.error('Erro ao processar rota Gemini:', error);
        res.status(500).json({ error: 'Falha ao processar requisição no Gateway Gemini' });
  }
});

export default router;
