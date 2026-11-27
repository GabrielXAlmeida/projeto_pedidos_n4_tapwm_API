# ⚙️ Doceria Hub Flow — API REST

> Projeto N4 — Turma TAPWM | Fatec  
> API REST responsável por autenticação, gerenciamento de produtos e pedidos da Doceria Hub Flow.

---

## 👥 Equipe

| Nome | Função | GitHub |
|------|--------|--------|
| Eric Gois | 📱 App Mobile (React Native / Expo) | [@ericfgois](https://github.com/ericfgois) |
| Gabriel Almeida | ⚙️ API REST (Node.js / Express) | [@GabrielXAlmeida](https://github.com/GabrielXAlmeida) |
| Marcelo Korin | 🌐 Web Admin (React / Vite) | [@MarceloKorin](https://github.com/MarceloKorin) |
| David | 🗄️ Banco de Dados (MySQL) | [@davidlima2007](https://github.com/davidlima2007) |

---

## 🔗 Repositórios do Projeto

| Parte | Repositório |
|-------|-------------|
| 📱 Mobile | [projeto_pedidos_n4_tapwm_APP](https://github.com/ericfgois/projeto_pedidos_n4_tapwm_APP) |
| ⚙️ API (este) | [projeto_pedidos_n4_tapwm_API](https://github.com/GabrielXAlmeida/projeto_pedidos_n4_tapwm_API) |
| 🌐 Web Admin | [projeto_pedidos_n4_tapwm_WEB](https://github.com/MarceloKorin/projeto_pedidos_n4_tapwm_WEB) |

---

## 🛠️ Tecnologias

- [Node.js](https://nodejs.org/) 18+
- [Express](https://expressjs.com/) (framework HTTP)
- [MySQL2](https://github.com/sidorares/node-mysql2) (driver do banco)
- [JWT](https://jwt.io/) (autenticação via token)
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) (hash de senhas)
- [Dotenv](https://github.com/motdotla/dotenv) (variáveis de ambiente)
- [CORS](https://github.com/expressjs/cors) (liberação de origens)

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [MySQL](https://www.mysql.com/) 8+ rodando localmente
- Banco de dados criado e populado (veja **Banco de Dados** abaixo)

---

## 🚀 Como Executar

### 1. Clone o repositório
```bash
git clone https://github.com/GabrielXAlmeida/projeto_pedidos_n4_tapwm_API.git
cd projeto_pedidos_n4_tapwm_API
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=doceria_hub_flow
JWT_SECRET=segredo_jwt
PORT=3000
```

### 4. Configure o banco de dados

Execute os scripts SQL na seguinte ordem:
```bash
# 1. Cria as tabelas
mysql -u root -p doceria_hub_flow < database/01_schema.sql

# 2. Insere dados iniciais
mysql -u root -p doceria_hub_flow < database/02_seed.sql
```

### 5. Inicie o servidor
```bash
npm start
```

A API ficará disponível em `http://localhost:3000`.

---

## 🔐 Credenciais de Teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Cliente (Mobile) | `cliente3@doceria.com` | `cli123` |
| Admin (Web) | `admin@doceria.com` | `admin123` |

---

## 📡 Endpoints

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/auth/login` | Login do usuário | ✅ |
| `POST` | `/auth/register` | Cadastro de usuário | ✅ |
| `GET` | `/produtos` | Lista todos os produtos | ✅ |
| `POST` | `/pedidos` | Cria um novo pedido | ✅ |
| `GET` | `/pedidos/meus` | Lista pedidos do usuário | ✅ |
| `GET` | `/pedidos/:id` | Detalhes de um pedido | ✅ |
| `PATCH` | `/pedidos/:id/status` | Atualiza status do pedido | ✅ Admin |

> ✅ Requer header `Authorization: Bearer <token>`

---

## 🗄️ Banco de Dados

Tabelas principais:

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Clientes e administradores |
| `produtos` | Catálogo de produtos da doceria |
| `pedidos` | Pedidos realizados |
| `itens_pedido` | Itens de cada pedido |

---

## 📁 Estrutura do Projeto

```
projeto_pedidos_n4_tapwm_API/
├── src/
│   ├── config/       # Conexão com o banco
│   ├── controllers/  # Lógica das rotas
│   ├── middlewares/  # Autenticação JWT
│   └── routes/       # Definição das rotas
├── database/
│   ├── 01_schema.sql # DDL — criação das tabelas
│   └── 02_seed.sql   # DML — dados iniciais
├── .env.example
├── server.js         # Ponto de entrada
└── package.json
```

---

## 📄 Licença

Projeto acadêmico — Fatec · N4 · TAPWM · 2026
