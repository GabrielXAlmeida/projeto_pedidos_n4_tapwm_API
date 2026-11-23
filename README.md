# API Backend — Doceria Hub Flow

**Integrantes do Grupo (N4):**
- David Lima Alves
- Eric Fracassi de Gois
- Gabriel Xavier de Almeida
- Marcelo Enrique Korin

API RESTful desenvolvida em **Node.js + Express**, integrada ao **PostgreSQL (Supabase)** com autenticação via **JWT** e controle de acesso por perfil (`admin` e `cliente`).

## Endpoints Principais
- `POST /auth/register` — Cadastro de novo usuário (perfil padrão: `cliente`).
- `POST /auth/login` — Login e retorno de token JWT + dados de perfil.
- `GET /produtos` — Listagem do catálogo de produtos ativos.
- `POST /produtos` — Cadastro de novo produto *(Restrito a Admin)*.
- `POST /pedidos` — Criação de pedido com múltiplos itens *(Autenticado)*.
- `GET /pedidos` — Listagem completa de pedidos com cliente, itens e total *(Restrito a Admin)*.
- `PATCH /pedidos/:id/status` — Atualização de status do pedido *(Restrito a Admin)*.
- `GET /pedidos/meus` — Histórico de pedidos do cliente autenticado.

## Execução Local
```bash
npm install
cp .env.example .env
# Preencha DATABASE_URL com a Connection String do Supabase
npm start
```
