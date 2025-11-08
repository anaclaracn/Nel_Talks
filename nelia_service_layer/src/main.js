// nelia_service_layer/src/main.js
const express = require('express');
const dotenv = require('dotenv');
const forumAgentService = require('./services/forumAgent');
// const dbService = require('./services/dbService'); // Se for usar o DB diretamente

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8001;

// --- Rota de Saúde (Health Check) ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'NELIA Service Layer' });
});

// --- Rota Principal de Interação do Chat (/chat/message) ---
// Roteado pelo API Gateway.
app.post('/chat/message', async (req, res) => {
    const { message, userId, isAnonymous } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: "O campo 'message' é obrigatório." });
    }

    try {
        // 1. Chamar o Agente ForumIA (GEMINI) para Classificação/Processamento
        // A lógica de integração e a decisão de chamar o RAG ocorre dentro do forumAgentService.
        const response = await forumAgentService.processMessage(message, userId, isAnonymous);

        // 2. Opcional: Atualizar log no DB (Se o NELIA for o único ponto de contato com o DB)
        // O Agente ForumIA (GEMINI) pode retornar os dados de log para o NELIA salvar.
        // if (response.logData) {
        //     await dbService.saveMessageLog(response.logData);
        // }

        // 3. Retornar a resposta final para o API Gateway
        return res.status(200).json({ 
            response: response.responseText,
            classification: response.classification,
            source: response.source // Se veio do RAG, a fonte é importante!
        });

    } catch (error) {
        console.error("Erro na orquestração do chat:", error.message);
        return res.status(500).json({ 
            error: "Falha na comunicação com o Agente GEMINI ou RAG.", 
            details: error.message 
        });
    }
});

// --- Rota de Log (Simples, se o NELIA for o orquestrador do Painel de Interações) ---
// app.get('/forum/messages', async (req, res) => {
//     // ... código para buscar mensagens do DB e retornar para o Front ...
// });

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`[NELIA Service] Rodando na porta ${PORT}`);
    console.log(`Forum Agent URL: ${process.env.AGENT_FORUM_IA_URL}`);
    console.log(`Docs Agent URL: ${process.env.AGENT_DOCS_IA_RAG_URL}`);
});