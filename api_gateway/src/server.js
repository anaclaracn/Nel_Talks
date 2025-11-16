// nelia-project/api_gateway/src/server.js - API Gateway Simples e Roteador

import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // Carrega variáveis de ambiente do .env
const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']; 
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Permite todos os métodos
    credentials: true, // Se você precisar enviar cookies
    optionsSuccessStatus: 204 // Retorna status 204 para o preflight (OPTIONS)
};
app.use(cors(corsOptions));


app.use(express.json()); // Habilita o parsing de JSON no corpo da requisição

// --- Configuração das URLs dos Microserviços ---
// Estas URLs são usadas para direcionar as requisições para os serviços internos.
const FORUM_SERVICE_URL = process.env.FORUM_SERVICE_URL || 'http://forum_agent:3000';
const NELIA_SERVICE_URL = process.env.NELIA_SERVICE_URL || 'http://nelia_service_layer:8001';
const DOCS_SERVICE_URL = process.env.DOCS_SERVICE_URL || 'http://front_agent:8000';


// --- Função de Proxy Genérica ---
// Esta função é o coração do Gateway. Ela pega uma requisição e a redireciona para um serviço de destino.
async function proxyRequest(req, res, targetBaseUrl) {
  // Constrói a URL completa para o serviço de destino.
  // req.originalUrl já contém o caminho completo da requisição recebida pelo Gateway (ex: /api/forum/posts).
  const targetUrl = `${targetBaseUrl}${req.originalUrl}`; 
  console.log(`[Gateway] Roteando ${req.method} ${req.originalUrl} -> ${targetUrl}`);

  try {
    // Faz a requisição HTTP para o serviço de destino usando axios.
    const response = await axios({
      method: req.method, // Usa o mesmo método HTTP da requisição original (GET, POST, etc.)
      url: targetUrl,
      headers: {
        'Content-Type': 'application/json',
        // Repassa o token de autorização, se presente. Essencial para autenticação.
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
      },
      data: req.body, // Repassa o corpo da requisição original (para POST, PUT, PATCH)
      params: req.query, // Repassa os parâmetros de query da requisição original (para GET)
    });

    // Retorna a resposta (status e dados) do serviço de destino diretamente ao cliente.
    res.status(response.status).json(response.data);
  } catch (error) {
        // Captura e trata erros que podem ocorrer:
        // - Erros de rede (serviço de destino inalcançável)
        // - Respostas HTTP com status de erro (4xx ou 5xx) do serviço de destino
        const statusCode = error.response ? error.response.status : 503; // 503 Service Unavailable é um bom fallback para erros de rede
        const message = error.response?.data?.detail 
                      || error.response?.data?.error 
                      || `Erro ao processar a requisição no destino (${targetBaseUrl}).`;
        console.error(`[Gateway Error] Rota ${req.originalUrl} para ${targetBaseUrl}:`, error.message);

        res.status(statusCode).json({
        error: message,
        service: targetBaseUrl,
        status: statusCode,
    });
  }
}

// --- Definição das Rotas de Proxy ---
// Cada 'app.all' define que todas as requisições (GET, POST, PUT, DELETE, etc.)
// para um determinado prefixo de URL serão encaminhadas para um serviço.

// Rota para o Agente ForumIA (Node.js/Gemini)
// Exemplos: GET /api/forum/posts, PATCH /api/forum/posts/:id/status
// Estas rotas são para gerenciamento direto de posts, sem passar pela orquestração da Nélia.
app.all('/api/forum/*', (req, res) => proxyRequest(req, res, FORUM_SERVICE_URL));

// Rotas para o NELIA Service Layer (Orquestrador)
// Exemplos: POST /chat, POST /chat/message
// Estas são as rotas principais para interação de chat, onde a Nélia decidirá qual agente chamar.
app.all('/chat', (req, res) => proxyRequest(req, res, NELIA_SERVICE_URL));
app.all('/chat/*', (req, res) => proxyRequest(req, res, NELIA_SERVICE_URL));

// Rotas para o Agente DocsIA (Python/Mistral/RAG)
// Exemplos: POST /onboarding/upload-doc, POST /rag/query
// Estas rotas podem ser para funcionalidades diretas de RAG (ex: upload de documentos ou consultas RAG específicas).
app.all('/onboarding/*', (req, res) => proxyRequest(req, res, DOCS_SERVICE_URL));
app.all('/rag/*', (req, res) => proxyRequest(req, res, DOCS_SERVICE_URL));


// --- Healthcheck do Gateway ---
// Um endpoint simples para verificar se o Gateway está online.
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'API Gateway', timestamp: new Date().toISOString() });
});

// --- Rota de fallback (Catch-all) ---
// Para qualquer rota que não foi definida acima, retorna 404 Not Found.
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado no API Gateway. Verifique a URL.' });
});

// Exporta o objeto 'app' para que `index.js` possa iniciar o servidor.
export default app;