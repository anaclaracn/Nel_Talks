// nelia_service_layer/src/services/forumAgentService.js
import axios from 'axios';

const FORUM_AGENT_URL = process.env.FORUM_AGENT_URL;

/**
 * Envia um texto para o Agente ForumIA para classificação.
 * @param {string} text - O texto a ser classificado.
 * @returns {Promise<object>} Um objeto contendo a classificação e o destino.
 */
export async function classifyText(text) {
    try {
        const response = await axios.post(`${FORUM_AGENT_URL}/api/forum/posts`, { texto: text });
        // Supondo que o Agente ForumIA retorne algo como { classificacao: 'duvida', destinadoPara: 'time', ... }
        // Se o seu Agente ForumIA apenas cria um post e retorna o post criado,
        // precisamos adaptar para extrair a classificação dele.
        // Por ora, vamos simular o retorno que precisamos.
        
        // Pelo seu Agente ForumIA, o endpoint /api/forum/posts CRIA o post e retorna o objeto criado.
        // Então, podemos extrair a classificação e o destino diretamente da resposta.
        const { classificacao, destinadoPara, id, status } = response.data;
        return { classificacao, destinadoPara, id, status };

    } catch (error) {
        console.error('[NELIA - ForumAgentService] Erro ao classificar texto com Agente ForumIA:', error.message);
        throw new Error('Falha ao classificar texto com Agente ForumIA.');
    }
}