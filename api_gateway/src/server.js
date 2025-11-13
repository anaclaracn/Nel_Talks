// src/server.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

// --- Import das rotas auxiliares ---
import geminiRoutes from './routes/gemini.js';
import neliaRoutes from './routes/nelia.js';
import ragRoutes from './routes/rag.js';

dotenv.config();
const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Configuração das URLs ---
const NELIA_SERVICE_URL = process.env.NELIA_SERVICE_URL || 'http://nelia_service_layer:8001';
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://agent_docs_ia_rag:8002';

// --- Função de Proxy Genérica ---
async function proxyRequest(req, res, targetBaseUrl) {
  const targetUrl = `${targetBaseUrl}${req.originalUrl}`;
  console.log(`[Gateway] Roteando ${req.method} ${req.originalUrl} para -> ${targetUrl}`);

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
      },
      data: req.body,
      params: req.query,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    const statusCode = error.response ? error.response.status : 503;
    const message = error.response?.data?.detail || error.response?.data?.error || 'Erro ao processar a requisição no destino.';
    console.error(`[Gateway Error] ${targetBaseUrl}:`, error.message);

    res.status(statusCode).json({
      error: message,
      service: targetBaseUrl,
      status: statusCode,
    });
  }
}

// --- Rotas internas ---
app.use('/gemini', geminiRoutes);
app.use('/nelia', neliaRoutes);
app.use('/rag', ragRoutes);

// --- Rotas via Proxy ---
app.all('/chat', (req, res) => proxyRequest(req, res, NELIA_SERVICE_URL));
app.all('/chat/*', (req, res) => proxyRequest(req, res, NELIA_SERVICE_URL));
app.all('/onboarding/*', (req, res) => proxyRequest(req, res, RAG_SERVICE_URL));
app.all('/rag/*', (req, res) => proxyRequest(req, res, RAG_SERVICE_URL));

// --- Healthcheck ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'API Gateway' });
});

// --- Catch-all ---
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado no API Gateway' });
});

//Exporta o app (não roda o servidor aqui)
export default app;
