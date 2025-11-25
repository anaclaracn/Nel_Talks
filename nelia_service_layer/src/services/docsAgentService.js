import axios from 'axios';

/**
 * Envia uma pergunta ao Agente DocsIA para obter uma resposta da documentação.
 * @param {string} question - A pergunta do usuário.
 * @returns {Promise<object>} Um objeto contendo a resposta e as fontes.
 */
export async function queryDocumentation(question) {
    const DOCS_AGENT_URL = process.env.DOCS_AGENT_URL;
    
    if (!DOCS_AGENT_URL) {
        throw new Error('DOCS_AGENT_URL não está configurada no ambiente da NELIA.');
    }

    try {
        // Agora faz GET para /ask com o parâmetro de query
        const targetUrl = `${DOCS_AGENT_URL}/ask?query=${encodeURIComponent(question)}`;
        console.log(`[NELIA - DocsAgentService] Chamando Agente DocsIA (RAG) em: ${targetUrl}`);

        const response = await axios.get(targetUrl);
        // O Agente DocsIA (RAG) retorna: { "answer": { "content": "..." }, "sources": [...] }
        // Precisamos extrair o 'content' e as 'sources'
        return {
            answer: response.data.answer && response.data.answer.content 
                        ? response.data.answer.content 
                        : "Não foi possível obter uma resposta clara do DocsIA.",
            sources: response.data.sources || []
        };
    } catch (error) {
        const errorDetail = error.response ? `Status ${error.response.status}: ${JSON.stringify(error.response.data)}` : error.message;
        console.error('[NELIA - DocsAgentService] Erro ao consultar documentação com Agente DocsIA:', errorDetail);
        throw new Error(`Falha ao consultar documentação com Agente DocsIA: ${errorDetail}`);
    }
}