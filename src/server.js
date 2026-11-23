const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    projeto: 'Doceria Hub Flow API',
    status: 'Online',
    versao: '1.0.0',
  });
});

app.use('/auth', authRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor API Doceria Hub Flow rodando em http://localhost:${PORT}`);
});
