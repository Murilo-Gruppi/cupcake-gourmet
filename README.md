# 🧁 Cupcake Gourmet

Plataforma de vendas online e gerenciamento de pedidos para uma loja de cupcakes gourmet.

**Projeto Integrador Transdisciplinar em Engenharia de Software II**  
Aluno: Murilo Bandeira Gruppi — RGM: 34169679

---

## 📋 Sobre o Projeto

Aplicação web responsiva desenvolvida com Next.js App Router, que permite aos clientes consultar produtos, realizar compras e acompanhar pedidos. Inclui painel administrativo para gerenciamento de produtos e pedidos.

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| Next.js 14 (App Router) | Framework principal |
| TypeScript | Linguagem |
| Tailwind CSS + shadcn/ui | Estilização |
| PostgreSQL | Banco de dados |
| Prisma ORM | Acesso ao banco |
| Docker Compose | Infraestrutura local |
| next-auth v5 | Autenticação |
| Zod | Validação |
| Zustand | Estado do carrinho (cliente) |
| Vitest | Testes unitários e de integração |
| Playwright | Testes end-to-end |

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd cupcake-gourmet
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` se necessário. Os valores padrão funcionam com o Docker Compose.

> ⚠️ Gere uma nova `AUTH_SECRET` para produção:
> ```bash
> openssl rand -base64 32
> ```

### 3. Iniciar o banco de dados

```bash
npm run db:up
```

Aguarde o container ficar saudável (cerca de 10 segundos).

### 4. Executar migrations

```bash
npm run db:migrate
```

> Em produção, use `npm run db:migrate:prod`

### 5. Popular banco com dados iniciais

```bash
npm run db:seed
```

Isso cria:
- 4 categorias de produtos
- 10 cupcakes de exemplo
- 1 usuário admin: `admin@cupcakegourmet.com` / `Admin@123456`
- 1 usuário cliente: `cliente@exemplo.com` / `Cliente@123456`

### 6. Iniciar a aplicação

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com cobertura
npm run test:coverage

# Testes E2E (requer aplicação rodando)
npm run test:e2e
```

---

## 🗂️ Estrutura do Projeto

```
src/
├── app/
│   ├── (store)/          # Páginas da loja (catálogo, carrinho, etc.)
│   ├── (auth)/           # Login e cadastro
│   ├── admin/            # Painel administrativo
│   └── api/              # Route Handlers (Controllers)
├── components/           # Componentes React reutilizáveis
├── modules/              # Lógica de negócio (Services + Repositories)
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   └── payments/
├── lib/                  # Utilitários e configurações
└── types/                # Tipos TypeScript compartilhados
```

---

## 🔐 Perfis de Acesso

| Perfil | Permissões |
|---|---|
| `CUSTOMER` | Consultar catálogo, gerenciar carrinho, realizar pedidos, consultar próprios pedidos |
| `ADMIN` | Todas as permissões de CUSTOMER + gerenciar produtos e todos os pedidos |

---

## 📡 API

| Método | Endpoint | Descrição | Auth |
|---|---|---|---|
| GET | `/api/products` | Listar produtos | — |
| GET | `/api/products/:id` | Consultar produto | — |
| POST | `/api/auth/register` | Cadastrar cliente | — |
| GET | `/api/cart` | Consultar carrinho | CUSTOMER |
| POST | `/api/cart/items` | Adicionar item | CUSTOMER |
| PATCH | `/api/cart/items/:id` | Alterar quantidade | CUSTOMER |
| DELETE | `/api/cart/items/:id` | Remover item | CUSTOMER |
| POST | `/api/orders` | Criar pedido | CUSTOMER |
| GET | `/api/orders` | Listar meus pedidos | CUSTOMER |
| GET | `/api/orders/:id` | Detalhe do pedido | CUSTOMER |
| GET | `/api/admin/products` | Listar produtos (admin) | ADMIN |
| POST | `/api/admin/products` | Criar produto | ADMIN |
| PATCH | `/api/admin/products/:id` | Atualizar produto | ADMIN |
| DELETE | `/api/admin/products/:id` | Desativar produto | ADMIN |
| GET | `/api/admin/orders` | Listar todos os pedidos | ADMIN |
| GET | `/api/admin/orders/:id` | Detalhe do pedido | ADMIN |
| PATCH | `/api/admin/orders/:id/status` | Atualizar status | ADMIN |

---

## 🗄️ Banco de Dados

```bash
# Abrir Prisma Studio (interface visual)
npm run db:studio

# Parar o banco
npm run db:down

# Resetar (apaga todos os dados)
npm run db:reset
```

---

## 📦 Scripts Disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia build de produção |
| `npm test` | Executa testes unitários |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npm run test:e2e` | Testes end-to-end |
| `npm run db:up` | Inicia o PostgreSQL via Docker |
| `npm run db:down` | Para o PostgreSQL |
| `npm run db:migrate` | Executa migrations |
| `npm run db:seed` | Popula banco com dados iniciais |
| `npm run db:studio` | Interface visual do Prisma |
| `npm run db:generate` | Regenera o Prisma Client |

---

## 📝 Status de Desenvolvimento

- [x] Sprint 1 — Fundação (configuração, banco, estrutura, 27 testes unitários)
- [x] Sprint 2 — Interface: shadcn/ui, layout, auth, catálogo, painel admin
- [ ] Sprint 3 — Carrinho + Checkout + Pedidos
- [ ] Sprint 4 — Painel Admin completo + Qualidade
- [ ] Sprint 5 — Validação + Entrega

---

## 📄 Documentação

- [`PRD.md`](./PRD.md) — Documento de Requisitos do Produto
- `docs/` — Diagramas e documentação técnica (em desenvolvimento)
