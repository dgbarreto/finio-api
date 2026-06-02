# finio-api

Backend da plataforma Finio — API REST para gerenciamento de finanças pessoais.

## Stack

- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **Framework**: Express
- **Banco de dados**: MongoDB Atlas + Mongoose
- **Validação**: Zod
- **Autenticação**: JWT + bcrypt
- **Deploy**: Railway
- **Container**: Docker (multi-stage build)

## Estrutura do projeto

```
src/
  config/
    database.ts
  modules/
    auth/
      auth.controller.ts
      auth.model.ts
      auth.routes.ts
      auth.service.ts
    budget/
      budget.controller.ts
      budget.model.ts
      budget.router.ts
      budget.service.ts
    insights/
      insights.controller.ts
      insights.router.ts
      insights.service.ts
    transactions/
      transaction.controller.ts
      transaction.model.ts
      transaction.routes.ts
      transaction.service.ts
  middleware/
    auth.ts           ← JWT middleware
    validate.ts       ← validação Zod genérica
    errorHandler.ts   ← error handler global
  errors/
    AppError.ts       ← erro com semântica HTTP
  schemas/
    auth.schemas.ts
    budget.schemas.ts
    insights.schemas.ts
    transaction.schemas.ts
  index.ts
```

## Endpoints

### Auth

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/register` | Cadastro de usuário | ✗ |
| POST | `/auth/login` | Login | ✗ |
| GET | `/auth/profile` | Dados do usuário autenticado | ✓ |

### Transactions

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/transactions` | Criar transação | ✓ |
| GET | `/transactions` | Listar transações (com filtros) | ✓ |
| GET | `/transactions/summary` | Resumo por tipo | ✓ |
| PUT | `/transactions/:id` | Atualizar transação | ✓ |
| DELETE | `/transactions/:id` | Deletar transação | ✓ |

**Filtros disponíveis** (query params): `category`, `type`, `startDate`, `endDate`

### Budgets

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/budgets` | Criar orçamento | ✓ |
| GET | `/budgets` | Listar orçamentos com progresso de gasto | ✓ |
| PUT | `/budgets/:id` | Atualizar orçamento | ✓ |
| DELETE | `/budgets/:id` | Deletar orçamento | ✓ |

### Insights

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/insights/spending-by-category` | Gastos por categoria no período | ✓ |
| GET | `/insights/monthly-evolution` | Evolução mensal (query param: `months`) | ✓ |
| POST | `/insights/summary` | Resumo financeiro do período | ✓ |

## Variáveis de ambiente

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=seu_secret
```

## Rodando localmente

**Com Docker Compose:**

```bash
docker compose up
```

**Sem Docker:**

```bash
npm install
npm run dev
```

## Deploy

A API é deployada automaticamente no Railway a cada push na branch `main`.

As variáveis de ambiente são configuradas diretamente na interface do Railway — o arquivo `.env` não é usado em produção.

## Padrões adotados

- **Validação**: toda rota com body usa o middleware `validate()` com schema Zod antes de chegar no controller
- **Erros**: erros de negócio usam `AppError` e são capturados pelo `errorHandler` global
- **Controllers**: funções puras de request/response, sem lógica de negócio
- **Services**: toda lógica de negócio e queries ao banco ficam aqui
- **Rotas**: declaradas no arquivo `*.router.ts` dentro do próprio módulo