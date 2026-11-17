# 🧁 Cupcake Gourmet

Plataforma de vendas online e gerenciamento de pedidos para uma confeitaria artesanal.

**Projeto Integrador Transdisciplinar em Engenharia de Software II**
**Aluno:** Murilo Bandeira Gruppi — RGM 34169679

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS + Radix UI |
| ORM | Prisma 7 |
| Banco de dados | PostgreSQL 16 (Docker) |
| Autenticação | next-auth v5 (JWT + Credentials) |
| Validação | Zod |
| Testes unitários/integração | Vitest |
| Testes E2E | Playwright |

---

## Pré-requisitos

- [Node.js](https://nodejs.org) >= 20
- [Docker](https://docker.com) e Docker Compose
- [Git](https://git-scm.com)

---

## Configuração do ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/cupcake-gourmet.git
cd cupcake-gourmet
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` se necessário. Para desenvolvimento local, os valores padrão já funcionam.

```env
DATABASE_URL="postgresql://cupcake:cupcake123@localhost:5432/cupcake_gourmet"
AUTH_SECRET="sua-chave-secreta-aqui-minimo-32-chars"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Inicie o banco de dados

```bash
npm run db:up
```

Aguarde o PostgreSQL iniciar (healthcheck automático via Docker Compose).

### 5. Execute as migrations

```bash
npm run db:migrate
```

### 6. Popule o banco com dados iniciais

```bash
npm run db:seed
```

Isso cria:
- 4 categorias (Clássicos, Especiais, Veganos, Sem Glúten)
- 10 produtos
- 1 usuário administrador
- 1 usuário cliente de teste

### 7. Inicie a aplicação

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## Credenciais de acesso (ambiente de desenvolvimento)

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Administrador | `admin@cupcakegourmet.com` | `Admin@123456` |
| Cliente | `cliente@exemplo.com` | `Cliente@123456` |

---

## Scripts disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor Next.js em modo desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção

# Banco de dados
npm run db:up        # Inicia PostgreSQL via Docker Compose
npm run db:down      # Para o PostgreSQL
npm run db:migrate   # Executa migrations pendentes
npm run db:seed      # Popula banco com dados iniciais
npm run db:studio    # Abre Prisma Studio (GUI do banco)
npm run db:reset     # Reseta banco e reaplica migrations

# Testes
npm run test                    # Testes unitários (Vitest)
npm run test:watch              # Testes em modo watch
npm run test:coverage           # Testes com relatório de cobertura

# E2E (requer servidor rodando)
npx playwright test             # Todos os testes E2E
npx playwright test --ui        # Interface visual do Playwright
npx playwright show-report      # Relatório HTML dos testes
```

---

## Estrutura do projeto

```
cupcake-gourmet/
├── docs/                          # Documentação acadêmica
│   ├── diagramas.md               # Casos de uso, classes, sequência, MER
│   ├── dicionario-dados.md        # Dicionário de dados completo
│   ├── manual-usuario.md          # Manual do usuário
│   ├── plano-testes.md            # Plano de testes
│   ├── evidencias-testes.md       # Evidências de execução
│   ├── avaliacao-colegas.md       # Avaliação dos 5 colegas
│   ├── laudo-qualidade.md         # Laudo de qualidade
│   └── melhorias-pos-testes.md    # Registro de melhorias
├── prisma/
│   ├── schema.prisma              # Schema do banco de dados
│   ├── migrations/                # Histórico de migrations
│   └── seed.ts                    # Script de seed
├── src/
│   ├── app/
│   │   ├── (store)/               # Rotas públicas da loja
│   │   ├── (auth)/                # Login e cadastro
│   │   ├── admin/                 # Painel administrativo
│   │   └── api/                   # Route Handlers (REST API)
│   ├── components/
│   │   ├── ui/                    # Componentes base (shadcn/ui manual)
│   │   ├── layout/                # Header, Footer, AdminSidebar, MobileNav
│   │   ├── products/              # ProductCard, ProductGrid, etc.
│   │   ├── cart/                  # CartItemRow, CartSummary
│   │   └── orders/                # OrderStatusBadge, OrderCard
│   ├── modules/                   # Lógica de negócio (Service/Repository)
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── payments/
│   ├── lib/
│   │   ├── prisma.ts              # Singleton PrismaClient
│   │   ├── auth.ts                # next-auth config (Node.js)
│   │   ├── auth.config.ts         # next-auth config (Edge-safe)
│   │   ├── errors.ts              # Hierarquia de erros da aplicação
│   │   └── utils/                 # cn(), formatCurrency(), etc.
│   ├── hooks/                     # useCart
│   ├── store/                     # Zustand (carrinho anônimo)
│   └── middleware.ts              # Proteção de rotas (Edge Runtime)
├── tests/
│   ├── unit/                      # Testes unitários (Vitest)
│   ├── integration/               # Testes de integração (Vitest + DB real)
│   └── e2e/                       # Testes E2E (Playwright)
├── docker-compose.yml
├── prisma.config.ts               # Configuração Prisma 7
├── .env.example
└── vitest.config.ts
```

---

## Arquitetura

A aplicação implementa arquitetura modular inspirada em MVC:

```
Request
  └── Route Handler (Controller) — validação HTTP, sessão
        └── Service — regras de negócio, orquestração
              └── Repository — queries Prisma
                    └── PostgreSQL
```

**Decisões arquiteturais relevantes:**
- Middleware no Edge Runtime usa `auth.config.ts` (sem Prisma) para evitar bundling de módulos Node.js
- Prisma 7 requer `PrismaPg` driver adapter explícito — configurado em `prisma.ts` e `seed.ts`
- Preços de pedidos consultados no banco durante checkout — cliente nunca determina o preço
- Produtos desativados (`active=false`) nunca deletados — preserva histórico de pedidos
- Carrinho anônimo via Zustand/localStorage; autenticado via banco de dados

---

## Documentação acadêmica

Todos os artefatos exigidos pelo PRD estão na pasta `/docs`:

- [Diagramas](docs/diagramas.md) — casos de uso, classes, sequência, atividades, MER
- [Dicionário de dados](docs/dicionario-dados.md)
- [Manual do usuário](docs/manual-usuario.md)
- [Plano de testes](docs/plano-testes.md)
- [Evidências dos testes](docs/evidencias-testes.md)
- [Avaliação dos colegas](docs/avaliacao-colegas.md)
- [Laudo de qualidade](docs/laudo-qualidade.md)
- [Registro de melhorias](docs/melhorias-pos-testes.md)

---

## Licença

Projeto acadêmico — uso educacional.
