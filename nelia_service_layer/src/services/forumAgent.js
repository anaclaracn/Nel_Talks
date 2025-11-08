// nelia_service_layer/src/services/forumAgent.js
const axios = require('axios');
const dotenv = require('dotenv');
const docsAgentService = require('./docsAgent'); // Importa o RAG para uso condicional

dotenv.config();

// URL do Agente ForumIA (GEMINI) - Ele será chamado aqui, mesmo que o código Gemini esteja no NELIA
const FORUM_AGENT_URL = process.env.AGENT_FORUM_IA_URL || 'http://agent_forum_ia:8003';

/**
 * Processa a mensagem do usuário, decide a ação e orquestra a resposta.
 * @param {string} message - Mensagem do usuário
 * @param {string} userId - ID do usuário (pode ser null se anônimo)
 */
async function processMessage(message, userId, isAnonymous) {
    
    // 1. Simulação de Chamada ao Agente ForumIA (GEMINI)
    // O GEMINI classifica a mensagem e sugere uma ação.
    let classificationResponse;
    try {
        // Chamada ao microserviço que hospeda o GEMINI (Agente ForumIA)
        classificationResponse = await axios.post(`${FORUM_AGENT_URL}/classify`, { message });
        
    } catch (error) {
        // Se o Agente ForumIA (GEMINI) estiver fora do ar
        return { responseText: "Desculpe, o Agente de Classificação está indisponível no momento." };
    }
    
    const { classification, requiresDocSearch } = classificationResponse.data;

    // 2. DECISÃO DE ORQUESTRAÇÃO: Se precisar de RAG
    if (requiresDocSearch) {
        console.log(`[NELIA] Mensagem classificada como ${classification}. Chamando RAG...`);
        
        // Chamada INTERNA para o Agente DocsIA (RAG)
        const ragResponse = await docsAgentService.queryRAG(message);
        
        // O Agente GEMINI pode adicionar contexto à resposta do RAG antes de retornar
        return {
            responseText: `Encontrei a seguinte informação na documentação: ${ragResponse.answer}`,
            classification,
            source: ragResponse.source
        };
    }

    // 3. Resposta Direta do Agente ForumIA (GEMINI)
    console.log(`[NELIA] Resposta direta (não documental) do GEMINI.`);
    
    // Simulação: Aqui o GEMINI faria uma chamada para gerar texto não-RAG e retornaria
    const directResponse = await axios.post(`${FORUM_AGENT_URL}/generate-response`, { 
        message, 
        classification 
    });

    return {
        responseText: directResponse.data.text,
        classification,
        source: null // Sem fonte se a resposta for direta
    };
}

module.exports = { processMessage };