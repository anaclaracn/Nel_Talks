const initDB = require('../config/db');
const { classifyPost, analyzeDestination } = require('../services/geminiService');

/**
 * Cria os posts
 */
exports.createPost = async (req, res) => {
  try {
    const { texto } = req.body;
    if (!texto) {
      return res.status(400).json({ error: 'O campo texto é obrigatório.' });
    }

    const db = await initDB();

    const [classificacao, destinadoPara] = await Promise.all([
      classifyPost(texto),
      analyzeDestination(texto),
    ]);

    const status = 'não visto';

    const [result] = await db.execute(
      'INSERT INTO posts (texto, classificacao, destinadoPara, status) VALUES (?, ?, ?, ?)',
      [texto, classificacao, destinadoPara, status]
    );

    res.status(201).json({
      id: result.insertId,
      texto,
      classificacao,
      destinadoPara,
      status,
    });
  } catch (error) {
    console.error('Erro ao criar post:', error.message);
    res.status(500).json({ error: 'Erro ao criar post.' });
  }
};


/**
 * Lista todos os posts
 */
exports.listPosts = async (req, res) => {
  const db = await initDB();
  try {
    const [rows] = await db.execute('SELECT * FROM posts ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar posts:', error.message);
    res.status(500).json({ error: 'Erro ao listar posts.' });
  }
};

/**
 * Atualiza o status de um post (para "visto" ou "não visto")
 */
exports.updateStatus = async (req, res) => {
  const db = await initDB();
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['visto', 'não visto'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido. Use "visto" ou "não visto".' });
    }

    const [result] = await db.execute('UPDATE posts SET status = ? WHERE id = ?', [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    res.json({ mensagem: 'Status atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar status:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar status.' });
  }
};

