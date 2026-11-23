const express = require('express');
const pool = require('../config/db');
const { autenticarToken, apenasAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nome, descricao, categoria, preco FROM produtos WHERE ativo = TRUE ORDER BY categoria, nome'
    );
    const produtos = result.rows.map((p) => ({
      ...p,
      preco: Number(p.preco),
    }));
    res.json(produtos);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ erro: 'Erro ao carregar catálogo de produtos.' });
  }
});

router.post('/', autenticarToken, apenasAdmin, async (req, res) => {
  const { nome, descricao, categoria, preco } = req.body;

  if (!nome || preco === undefined) {
    return res.status(400).json({ erro: 'Nome e preço do produto são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO produtos (nome, descricao, categoria, preco) VALUES ($1, $2, $3, $4) RETURNING id, nome, descricao, categoria, preco',
      [nome.trim(), descricao || '', categoria || 'Doces', Number(preco)]
    );
    const novo = { ...result.rows[0], preco: Number(result.rows[0].preco) };
    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar produto.' });
  }
});

module.exports = router;
