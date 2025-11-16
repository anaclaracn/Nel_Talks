// nelia-project/api_gateway/index.js (Ponto de entrada do API Gateway)

import app from './src/server.js'; // Importa o objeto 'app' configurado

const PORT = process.env.PORT || 8000; // Define a porta, padrão 8000

// Inicia o servidor e escuta na porta definida
const server = app.listen(PORT, () => {
    console.log(`[API Gateway] Rodando na porta ${PORT}`);
    // Loga as URLs dos serviços para fácil depuração
    console.log(`FORUM Service URL: ${process.env.FORUM_SERVICE_URL}`);
    console.log(`NELIA Service URL: ${process.env.NELIA_SERVICE_URL}`);
    console.log(`DOCS Service URL: ${process.env.DOCS_SERVICE_URL}`);
});

// Gerenciamento de encerramento (Graceful Shutdown)
// Isso é crucial para que o contêiner Docker feche de forma limpa.
process.on('SIGTERM', () => {
  console.log('[API Gateway] Sinal SIGTERM recebido: Fechando servidor HTTP...');
  server.close(() => {
      console.log('[API Gateway] Servidor HTTP fechado.');
      process.exit(0); // Encerra o processo com sucesso
  });
});

process.on('SIGINT', () => {
  console.log('[API Gateway] Sinal SIGINT recebido (Ctrl+C): Fechando servidor HTTP...');
  server.close(() => {
      console.log('[API Gateway] Servidor HTTP fechado.');
      process.exit(0); // Encerra o processo com sucesso
  });
});