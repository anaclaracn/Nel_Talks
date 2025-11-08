// nelia_service_layer/src/services/docsAgent.js
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// URL do Agente DocsIA (RAG)
const DOCS_AGENT_URL = process.env.AGENT_DOCS_IA_RAG_URL || 'http://agent_docs_ia_rag:8002';

/**
 * Chama o microserviço RAG para buscar informações na base de conhecimento.
 * @param {string} question - Pergunta a ser respondida via RAG
 */
async function queryRAG(question) {
    try {
        const response = await axios.post(`${DOCS_AGENT_URL}/query`, { question });

        // Retorna a resposta (answer) e a fonte (source) do Agente DocsIA
        return {
            answer: response.data.answer,
            source: response.data.source || 'Não identificada'
        };

    } catch (error) {
        console.error("Erro ao consultar o Agente DocsIA (RAG):", error.message);
        return {
            answer: "Não foi possível consultar a base de conhecimento no momento. Tente novamente mais tarde.",
            source: null
        };
    }
}

module.exports = { queryRAG };