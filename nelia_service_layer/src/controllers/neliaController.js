// nelia_service_layer/src/controllers/neliaController.js
import { classifyText } from '../services/forumAgentService.js';
import { queryDocumentation } from '../services/docsAgentService.js';

/**
 * Lida com mensagens de chat, orquestrando entre os agentes.
 * @param {object} req - Objeto de requisição do Express.
 * @param {object} res - Objeto de resposta do Express.
 */
export async function handleChatMessage(req, res) {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'O campo "message" é obrigatório.' });
    }

    try {
        console.log(`[NELIA] Recebida mensagem: "${message}"`);

        // 1. Chamar o Agente ForumIA (Node.js/Gemini) para classificar a mensagem
        const { classificacao, destinadoPara, id: postId } = await classifyText(message);
        console.log(`[NELIA] Classificação do Agente ForumIA: ${classificacao}, Destino: ${destinadoPara}`);

        let responseToUser = {
            classification: classificacao,
            destination: destinadoPara,
            message: '', // Mensagem final para o usuário
            origin: 'ForumIA' // Agente que gerou a resposta principal
        };

        // 2. Orquestrar com base na classificação
        if (classificacao.toLowerCase() === 'dúvida') {
            console.log('[NELIA] Mensagem classificada como "dúvida", consultando Agente DocsIA...');
            
            // Chamar o Agente DocsIA (Python/Mistral)
            const docsResponse = await queryDocumentation(message);
            
            responseToUser.message = docsResponse.answer || 'Não encontrei informações suficientes na documentação para responder sua dúvida.';
            responseToUser.origin = 'DocsIA';
            // Você pode adicionar as fontes também se quiser expor ao front
            responseToUser.sources = docsResponse.sources;

        } else if (classificacao.toLowerCase() === 'reclamação' || classificacao.toLowerCase() === 'sugestão') {
            console.log(`[NELIA] Mensagem classificada como "${classificacao}", registrando e agradecendo.`);
            // Para "reclamação" e "sugestão", podemos ter uma resposta padrão.
            // O post já foi criado no Agente ForumIA na chamada acima.
            responseToUser.message = `Obrigado por sua ${classificacao}. Ela foi registrada com sucesso (ID: ${postId}) e será encaminhada à ${destinadoPara}.`;
            responseToUser.origin = 'ForumIA'; // A resposta final ainda se baseia na ação do ForumIA
        } else {
            console.log(`[NELIA] Classificação desconhecida: "${classificacao}".`);
            responseToUser.message = 'Sua mensagem foi recebida e estamos avaliando a melhor forma de prosseguir.';
        }

        res.status(200).json(responseToUser);

    } catch (error) {
        console.error('[NELIA] Erro na orquestração da mensagem:', error.message);
        res.status(500).json({ error: 'Erro interno na NELIA Service Layer.', details: error.message });
    }
}