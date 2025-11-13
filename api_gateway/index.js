// api_gateway/index.js (NOVO ARQUIVO: Apenas para iniciar o servidor)
import app from './src/server.js'; // Importa o objeto app que acabamos de exportar

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`[API Gateway] Rodando na porta ${PORT}`);
    console.log(`NELIA Service URL: ${process.env.NELIA_SERVICE_URL}`);
    console.log(`RAG Service URL: ${process.env.RAG_SERVICE_URL}`);
});

// Adicione este código para gerenciamento de encerramento, útil para Docker
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: Closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});