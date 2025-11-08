// api_gateway/src/server.js
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente (URLs dos microserviços)
dotenv.config();

const app = express();
// Configuração do CORS (CRUCIAL para o Front-end React acessar o Gateway)
// Em produção, limite isso apenas ao domínio do seu front-end!
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(express.json());

// --- Configurações das URLs (Consolidadas) ---
const PORT = process.env.PORT || 8000;
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
                // Copia headers de autenticação do usuário, se existirem
                ...(req.headers.authorization && { 'Authorization': req.headers.authorization }), 
            },
            data: req.body, 
            params: req.query 
        });

        // Retorna a resposta do microserviço de destino
        res.status(response.status).json(response.data);

    } catch (error) {
        // Trata erros de conexão ou resposta do microserviço
        const statusCode = error.response ? error.response.status : 503;
        const message = error.response && error.response.data ? 
            error.response.data.detail || error.response.data.error || 'Erro ao processar a requisição no destino.' : 
            'Serviço de destino indisponível.';
        
        console.error(`[Gateway Error] Roteando para ${targetBaseUrl}:`, error.message);
        res.status(statusCode).json({
            error: message,
            service: targetBaseUrl,
            status: statusCode
        });
    }
}

// --- ROTAS DO GATEWAY (FINAL) ---

// 1. Rota de Saúde
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'API Gateway' });
});

// 2. Roteamento para o NELIA Service Layer (/chat/...)
// Roteia para NELIA (Orquestrador do Chat/Classificação)
app.all('/chat/*', (req, res) => {
    proxyRequest(req, res, NELIA_SERVICE_URL);
});

// 3. Roteamento para o Agente RAG (Busca Direta do Onboarding)
// Roteia diretamente para o Agente DocsIA/RAG para a funcionalidade de busca RAG direta.
app.all('/onboarding/*', (req, res) => {
    proxyRequest(req, res, RAG_SERVICE_URL);
});

// 4. Roteamento Direto para o Agente RAG (Administração e Indexação de Documentos)
// Roteia diretamente para o Agente DocsIA/RAG para o fluxo de BERT/DB.INSERT.
app.all('/rag/*', (req, res) => {
    proxyRequest(req, res, RAG_SERVICE_URL);
});


// 5. Catch-all
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado no API Gateway' });
});

// Inicia o servidor do Gateway
app.listen(PORT, () => {
    console.log(`[API Gateway] Rodando na porta ${PORT}`);
    console.log(`NELIA Service URL: ${NELIA_SERVICE_URL}`);
    console.log(`RAG Service URL: ${RAG_SERVICE_URL}`);
});

module.exports = app;