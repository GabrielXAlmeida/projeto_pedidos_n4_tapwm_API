const express = require('express');
const pool = require('../config/db');
const { autenticarToken, apenasAdmin } = require('../middlewares/auth');

const router = express.Router();

router.post('/', autenticarToken, async (req, res) => {
  const { itens, observacao } = req.body;

  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: 'Selecione pelo menos um produto para montar o pedido.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let valorTotal = 0;
    const itensValidados = [];

    for (const item of itens) {
      const prodRes = await client.query('SELECT id, nome, preco FROM produtos WHERE id = $1', [item.produto_id]);
      if (prodRes.rows.length === 0) {
        throw new Error(`Produto ID ${item.produto_id} não encontrado.`);
      }
      const prod = prodRes.rows[0];
      const qtd = Number(item.quantidade);
      if (qtd <= 0) continue;

      const precoUnit = Number(prod.preco);
      valorTotal += precoUnit * qtd;

      itensValidados.push({
        produto_id: prod.id,
        quantidade: qtd,
        preco_unitario: precoUnit,
      });
    }

    if (itensValidados.length === 0) {
      throw new Error('Nenhum item válido no pedido.');
    }

    const pedidoRes = await client.query(
      'INSERT INTO pedidos (usuario_id, valor_total, status, observacao) VALUES ($1, $2, $3, $4) RETURNING id, valor_total, status, observacao, criado_em',
      [req.user.id, valorTotal.toFixed(2), 'Pendente', observacao || '']
    );

    const pedido = pedidoRes.rows[0];

    for (const item of itensValidados) {
      await client.query(
        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)',
        [pedido.id, item.produto_id, item.quantidade, item.preco_unitario]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({
      ...pedido,
      valor_total: Number(pedido.valor_total),
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar pedido:', err);
    res.status(400).json({ erro: err.message || 'Erro ao finalizar pedido.' });
  } finally {
    client.release();
  }
});

router.get('/', autenticarToken, apenasAdmin, async (req, res) => {
  try {
    const pedidosRes = await pool.query(`
      SELECT 
        p.id,
        p.valor_total,
        p.status,
        p.observacao,
        p.criado_em,
        u.id AS cliente_id,
        u.nome AS cliente_nome,
        u.email AS cliente_email
      FROM pedidos p
      INNER JOIN usuarios u ON u.id = p.usuario_id
      ORDER BY p.criado_em DESC
    `);

    const itensRes = await pool.query(`
      SELECT 
        ip.pedido_id,
        ip.quantidade,
        ip.preco_unitario,
        pr.nome AS produto_nome,
        pr.categoria AS produto_categoria
      FROM itens_pedido ip
      INNER JOIN produtos pr ON pr.id = ip.produto_id
    `);

    const itensPorPedido = {};
    for (const item of itensRes.rows) {
      if (!itensPorPedido[item.pedido_id]) {
        itensPorPedido[item.pedido_id] = [];
      }
      itensPorPedido[item.pedido_id].push({
        produto_nome: item.produto_nome,
        categoria: item.produto_categoria,
        quantidade: item.quantidade,
        preco_unitario: Number(item.preco_unitario),
        subtotal: Number((item.quantidade * Number(item.preco_unitario)).toFixed(2)),
      });
    }

    const resultado = pedidosRes.rows.map((p) => ({
      id: p.id,
      status: p.status,
      observacao: p.observacao,
      valor_total: Number(p.valor_total),
      criado_em: p.criado_em,
      cliente: {
        id: p.cliente_id,
        nome: p.cliente_nome,
        email: p.cliente_email,
      },
      itens: itensPorPedido[p.id] || [],
    }));

    res.json(resultado);
  } catch (err) {
    console.error('Erro ao listar pedidos:', err);
    res.status(500).json({ erro: 'Erro ao carregar pedidos.' });
  }
});

router.patch('/:id/status', autenticarToken, apenasAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const permitidos = ['Pendente', 'Em Preparo', 'Concluído'];

  if (!permitidos.includes(status)) {
    return res.status(400).json({ erro: 'Status inválido.' });
  }

  try {
    const result = await pool.query(
      'UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    res.status(500).json({ erro: 'Erro ao atualizar status do pedido.' });
  }
});

router.get('/meus', autenticarToken, async (req, res) => {
  try {
    const pedidosRes = await pool.query(
      'SELECT id, valor_total, status, observacao, criado_em FROM pedidos WHERE usuario_id = $1 ORDER BY criado_em DESC',
      [req.user.id]
    );

    const itensRes = await pool.query(`
      SELECT ip.pedido_id, ip.quantidade, ip.preco_unitario, pr.nome AS produto_nome
      FROM itens_pedido ip
      INNER JOIN produtos pr ON pr.id = ip.produto_id
      INNER JOIN pedidos p ON p.id = ip.pedido_id
      WHERE p.usuario_id = $1
    `, [req.user.id]);

    const itensPorPedido = {};
    for (const item of itensRes.rows) {
      if (!itensPorPedido[item.pedido_id]) itensPorPedido[item.pedido_id] = [];
      itensPorPedido[item.pedido_id].push({
        produto_nome: item.produto_nome,
        quantidade: item.quantidade,
        preco_unitario: Number(item.preco_unitario),
      });
    }

    const lista = pedidosRes.rows.map((p) => ({
      ...p,
      valor_total: Number(p.valor_total),
      itens: itensPorPedido[p.id] || [],
    }));

    res.json(lista);
  } catch (err) {
    console.error('Erro ao buscar meus pedidos:', err);
    res.status(500).json({ erro: 'Erro ao carregar seus pedidos.' });
  }
});

module.exports = router;
