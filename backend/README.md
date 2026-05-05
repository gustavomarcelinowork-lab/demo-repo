# Cotações em Tempo Real

Aplicação web que exibe cotações de IBOV, LWSA3 e Dólar em tempo real, no estilo Infomoney.

## Stack
- Frontend: React + TypeScript (Vite)
- Backend: Node.js + Express
- Infra: Docker + Docker Compose
- Testes: Jest — cobertura acima de 50%
- Dados: brapi.dev

## Como rodar
1. Clone o repositório
2. Crie o arquivo `backend/.env` com: `BRAPI_TOKEN=seu_token`
3. Na raiz do projeto: `docker compose up --build`
4. Acesse: http://localhost:3000

## Endpoints
- GET /health — status da API
- GET /quotes — cotações atuais (IBOV, LWSA3, USD)