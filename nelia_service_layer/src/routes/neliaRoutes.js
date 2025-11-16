// nelia_service_layer/src/routes/neliaRoutes.js
import express from 'express';
import { handleChatMessage } from '../controllers/neliaController.js';

const router = express.Router();

// Rota principal para mensagens de chat
// Pode ser acessada via /nelia/message ou /chat
router.post('/message', handleChatMessage);
router.post('/', handleChatMessage); // Para /nelia ou /chat direto

export default router;