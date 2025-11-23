// nelia_service_layer/src/services/forumAgentService.js

import axios from 'axios';
import dotenv from 'dotenv'; // Importe o dotenv aqui para garantir que esteja no escopo
// Você pode precisar garantir que o dotenv esteja configurado aqui também, dependendo da sua setup.
// dotenv.config({ path: '../.env' }); // <-- Descomente se o dotenv não estiver carregando a variável

// NÂO defina a constante URL globalmente, acesse-a dentro da função
// const FORUM_AGENT_URL = process.env.FORUM_AGENT_URL; // <--- COMENTAR OU REMOVER ESTA LINHA

/**
 * Envia um texto para o Agente ForumIA para classificação e persistência (cria o post no DB).
 */
export async function classifyAndSavePost(text, userId = 'anon_user', isAnonymous = false) {
    
    // ACESSE A VARIÁVEL DE AMBIENTE DENTRO DA FUNÇÃO
    const FORUM_AGENT_URL = process.env.FORUM_AGENT_URL;
    
    if (!FORUM_AGENT_URL) {
        // Isso é um erro de configuração CRÍTICO
        console.error('FORUM_AGENT_URL não está configurada!');
        throw new Error('FORUM_AGENT_URL não está configurada no ambiente. Verifique o .env.');
    }
    
    const TARGET_URL = `${FORUM_AGENT_URL}/api/forum/posts`; // Seu Agente ForumIA usa /api/forum/posts

    try {
        console.log(`[ForumAgentService] Chamando ForumIA em: ${TARGET_URL}`);
        
        // Chamada POST para o endpoint do Agente ForumIA
        const response = await axios.post(TARGET_URL, { 
            texto: text, // O Agente ForumIA espera o campo 'texto'
            userId: userId,
            isAnonymous: isAnonymous
        });

        return response.data; // Retorna o objeto do post criado
        
    } catch (error) {
        console.error(`[ForumAgentService] Erro ao chamar ${TARGET_URL}:`, error.message);
        throw new Error(`Falha na comunicação com o Agente ForumIA. Detalhe: ${error.message}`);
    }
}