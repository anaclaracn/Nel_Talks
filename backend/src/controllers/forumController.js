const { classifyPost } = require('../services/geminiService');
const db = require('../config/db'); 

// Cria um post e salva no banco
exports.createPost = async (req, res) => {
  const { texto } = req.body;

  try {
    const classificacao = await classifyPost(texto);

    const resultado = await db.execute(
  'INSERT INTO posts (texto, classificacao) VALUES (?, ?)',
  [texto, classificacao]
);

const insertId = Array.isArray(resultado[0]) ? resultado[0].insertId : resultado.insertId;

res.status(201).json({
  id: insertId,
  texto,
  classificacao,
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao classificar ou salvar o post.' });
  }
};

// Lista todos os posts
exports.listPosts = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM posts');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar posts.' });
  }
};


