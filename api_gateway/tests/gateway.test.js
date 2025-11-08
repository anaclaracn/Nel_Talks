// api_gateway/tests/gateway.test.js
const request = require('supertest');
const app = require('../src/server'); 
const axios = require('axios');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente (necessário para que `app` as tenha)
dotenv.config({ path: './.env' }); 

// Mocka o módulo axios para interceptar as chamadas HTTP que o Gateway faria
jest.mock('axios');

describe('API Gateway Routing', () => {

    // Antes de cada teste, reseta os mocks do axios para evitar interferências
    beforeEach(() => {
        axios.mockClear(); 
        axios.mockReset(); 
    });

    afterAll(() => {
        // Encerra qualquer conexão HTTP aberta pelo axios mockado
        // Isso é comum quando se usa Supertest em módulos Node.js
        jest.useRealTimers();
    });

    // --- Teste 1: Rota de Saúde do Gateway ---
    test('GET /health should return 200 OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ status: 'ok', service: 'API Gateway' });
    });

    // --- Teste 2: Roteamento para NELIA Service Layer (/chat/*) ---
    test('POST /chat/message should route to NELIA Service', async () => {
        const mockNeliaResponse = { message: 'Chat processed by NELIA' };
        axios.mockResolvedValueOnce({ status: 200, data: mockNeliaResponse });

        const chatPayload = { text: 'Olá NELIA, como você está?' };
        const res = await request(app)
            .post('/chat/message')
            .send(chatPayload);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockNeliaResponse);
        expect(axios).toHaveBeenCalledTimes(1);
        expect(axios).toHaveBeenCalledWith(
            expect.objectContaining({
                method: expect.any(String), 
                url: `${process.env.NELIA_SERVICE_URL}/chat/message`,
                data: chatPayload,
                // CORREÇÃO: Incluir o header e params vazios que o Express/Axios enviam
                headers: expect.objectContaining({ 'Content-Type': 'application/json' }), 
                params: {},
            })
        );
    });

    // --- Teste 3: Roteamento para RAG Service (Onboarding - /onboarding/*) ---
    test('POST /onboarding/query should route directly to RAG Service', async () => {
        const mockRagResponse = { answer: 'Resposta do RAG para Onboarding.' };
        axios.mockResolvedValueOnce({ status: 200, data: mockRagResponse });

        const onboardingPayload = { question: 'O que devo fazer nas reuniões semanais?' };
        const res = await request(app)
            .post('/onboarding/query')
            .send(onboardingPayload);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockRagResponse);
        expect(axios).toHaveBeenCalledTimes(1);
        expect(axios).toHaveBeenCalledWith(
            expect.objectContaining({
                method: expect.any(String), 
                url: `${process.env.RAG_SERVICE_URL}/onboarding/query`,
                data: onboardingPayload,
                // CORREÇÃO: Incluir o header e params vazios
                headers: expect.objectContaining({ 'Content-Type': 'application/json' }), 
                params: {},
            })
        );
    });

    // --- Teste 4: Roteamento para RAG Service (Admin/Documents - /rag/*) ---
    test('POST /rag/documents/upload should route directly to RAG Service', async () => {
        const mockRagResponse = { status: 'Document uploaded successfully' };
        axios.mockResolvedValueOnce({ status: 200, data: mockRagResponse });

        const docPayload = { filename: 'regimento.pdf', content: 'Base64EncodedContent' };
        const res = await request(app)
            .post('/rag/documents/upload')
            .send(docPayload);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockRagResponse);
        expect(axios).toHaveBeenCalledTimes(1);
        expect(axios).toHaveBeenCalledWith(
            expect.objectContaining({
                method: expect.any(String), 
                url: `${process.env.RAG_SERVICE_URL}/rag/documents/upload`,
                data: docPayload,
                // CORREÇÃO: Incluir o header e params vazios
                headers: expect.objectContaining({ 'Content-Type': 'application/json' }), 
                params: {},
            })
        );
    });

    // --- Teste 5: Lidar com Serviço de Destino Indisponível ---
    test('should return 503 if target NELIA Service is unavailable', async () => {
        axios.mockRejectedValueOnce(new Error('Network Error: NELIA is down'));

        const chatPayload = { text: 'Testando serviço indisponível' };
        const res = await request(app)
            .post('/chat/message')
            .send(chatPayload);

        expect(res.statusCode).toEqual(503);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('Serviço de destino indisponível.');
        expect(axios).toHaveBeenCalledTimes(1);
    });

    // --- Teste 6: Lidar com Rota Não Encontrada no Gateway ---
    test('should return 404 for undefined routes', async () => {
        const res = await request(app).get('/non-existent-route');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({ error: 'Endpoint não encontrado no API Gateway' });
    });
});