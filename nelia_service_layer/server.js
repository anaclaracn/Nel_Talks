// nelia_service_layer/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import neliaRoutes from './src/routes/neliaRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas da NELIA
app.use('/nelia', neliaRoutes);
app.use('/chat', neliaRoutes); // Uma rota mais amigável para o chat

// Healthcheck
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'NELIA Service Layer', timestamp: new Date().toISOString() });
});

// Catch-all para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado na NELIA Service Layer.' });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`[NELIA Service Layer] Rodando na porta ${PORT}`);
    console.log(`FORUM_AGENT_URL: ${process.env.FORUM_AGENT_URL}`);
    console.log(`DOCS_AGENT_URL: ${process.env.DOCS_AGENT_URL}`);
});