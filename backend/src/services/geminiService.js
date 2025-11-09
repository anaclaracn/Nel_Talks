const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Classifica um texto como 'reclamação', 'dúvida' ou 'sugestão'
 * @param {string} texto - O TEXTO PURO (string)
 * @returns {Promise<string>} classificação
 */
async function classifyPost(texto) {

  if (typeof texto !== 'string' || texto.trim().length === 0) {
    throw new Error('O texto fornecido para classificação é inválido.');
  }

  try {

    const payload = {
      contents: [{
        parts: [{
          text: `Classifique o seguinte texto APENAS como "reclamação", "dúvida" ou "sugestão": ${texto}`
        }]
      }]
    };

    const response = await axios.post(
      API_URL,
      payload, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const classification = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!classification) {
      throw new Error('Nenhuma classificação retornada pela API.');
    }

    return classification.trim();

  } catch (error) {
    const apiError = error.response?.data?.error;
    if (apiError) {
      console.error('Erro detalhado da API Gemini:', JSON.stringify(apiError, null, 2));
      throw new Error(apiError.message);
    } else {
      console.error('Erro ao chamar API do Gemini:', error.message);
      throw error;
    }
  }
}

module.exports = {
  classifyPost,
};