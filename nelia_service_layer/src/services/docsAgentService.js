// nelia_service_layer/src/services/docsAgentService.js
import axios from 'axios';

const DOCS_AGENT_URL = process.env.DOCS_AGENT_URL;

/**
 * Envia uma pergunta ao Agente DocsIA para obter uma resposta da documentação.
 * @param {string} question - A pergunta do usuário.
 * @returns {Promise<object>} Um objeto contendo a resposta e as fontes.
 */
export async function queryDocumentation(question) {
    try {
        const response = await axios.post(`${DOCS_AGENT_URL}/query`, { question: question });
        // Supondo que o Agente DocsIA retorne { answer: "...", sources: [...] }
        return response.data;
    } catch (error) {
        console.error('[NELIA - DocsAgentService] Erro ao consultar documentação com Agente DocsIA:', error.message);
        throw new Error('Falha ao consultar documentação com Agente DocsIA.');
    }
}