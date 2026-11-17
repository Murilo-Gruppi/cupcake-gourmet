# Plano de Testes — Cupcake Gourmet
**Projeto Integrador Transdisciplinar em Engenharia de Software II**
**Aluno:** Murilo Bandeira Gruppi — RGM 34169679

---

## 1. Objetivo

Garantir que a aplicação Cupcake Gourmet atende aos requisitos funcionais e não funcionais especificados no PRD, por meio de testes unitários, de integração e end-to-end.

---

## 2. Escopo

| Módulo | Unitário | Integração | E2E |
|--------|----------|------------|-----|
| Autenticação | ✅ | ✅ | ✅ |
| Catálogo de produtos | ✅ | ✅ | ✅ |
| Carrinho | ✅ | — | ✅ |
| Checkout e pedidos | ✅ | ✅ | ✅ |
| Painel administrativo | — | — | ✅ |
| Validações Zod | ✅ | — | — |

---

## 3. Ferramentas

| Ferramenta | Versão | Uso |
|------------|--------|-----|
| Vitest | 5.x | Testes unitários e de integração |
| @testing-library/react | — | Renderização de componentes |
| Playwright | 1.x | Testes end-to-end (Chrome + mobile) |
| @faker-js/faker | — | Geração de dados de teste |

---

## 4. Testes Unitários

### 4.1 `auth.service` — 6 casos

| ID | Cenário | Resultado esperado |
|----|---------|-------------------|
| AU01 | Registrar usuário com dados válidos | Usuário criado com role CUSTOMER |
| AU02 | Senha armazenada como hash bcrypt | `passwordHash` ≠ senha original |
| AU03 | Registrar com e-mail já existente | Lança `ConflictError` |
| AU04 | E-mail normalizado para minúsculas | `email` em lowercase |
| AU05 | Nome com espaços extras é trimado | `name` sem espaços desnecessários |
| AU06 | Input inválido lança ValidationError | Schema Zod rejeita dados malformados |

### 4.2 `product.service` — 8 casos

| ID | Cenário | Resultado esperado |
|----|---------|-------------------|
| PR01 | Buscar produto ativo por ID | Retorna ProductDTO com preço como number |
| PR02 | Buscar produto inexistente | Lança `NotFoundError` |
| PR03 | Criar produto com dados válidos | Produto persistido e retornado como DTO |
| PR04 | Criar produto com preço negativo | Lança `ValidationError` |
| PR05 | Desativar produto existente | `active` passa para `false` |
| PR06 | Desativar produto inexistente | Lança `NotFoundError` |
| PR07 | Listar produtos retorna apenas ativos | Produtos inativos excluídos da listagem |
| PR08 | DTO converte Decimal para number | `price` como `number` em vez de `Decimal` |

### 4.3 `cart.service` — 10 casos

| ID | Cenário | Resultado esperado |
|----|---------|-------------------|
| CA01 | Buscar/criar carrinho para usuário novo | Carrinho criado e retornado |
| CA02 | Adicionar item ao carrinho | CartItem criado com quantidade correta |
| CA03 | Adicionar produto já existente | Quantidade somada (upsert) |
| CA04 | Remover item do carrinho | CartItem deletado |
| CA05 | Remover item de outro usuário | Lança `ForbiddenError` |
| CA06 | Atualizar quantidade de item | Quantidade atualizada |
| CA07 | Atualizar item de outro usuário | Lança `ForbiddenError` |
| CA08 | Quantidade inválida (0) | Lança `ValidationError` |
| CA09 | Quantidade máxima (99) | Aceita e persiste |
| CA10 | Calcular total do carrinho | Soma correta de subtotais |

### 4.4 `order.service` — 11 casos

| ID | Cenário | Resultado esperado |
|----|---------|-------------------|
| OR01 | Criar pedido com carrinho válido | Order + OrderItems + Payment criados |
| OR02 | Criar pedido com carrinho vazio | Lança `BadRequestError` |
| OR03 | Preço do OrderItem vem do banco | Não usa preço enviado pelo cliente |
| OR04 | Total calculado pelo servidor | Sum(quantity × unitPrice) do banco |
| OR05 | Operação em transação atômica | Falha parcial faz rollback |
| OR06 | Buscar pedido por ID e userId | Retorna pedido do usuário |
| OR07 | Buscar pedido de outro usuário | Lança `NotFoundError` |
| OR08 | Atualizar status como admin | Status atualizado com sucesso |
| OR09 | Atualizar status como customer | Lança `UnauthorizedError` |
| OR10 | Listar pedidos do usuário | Retorna apenas pedidos do usuário |
| OR11 | Snapshot de preço preservado | productName e unitPrice imutáveis |

### 4.5 Validações Zod — 29 casos

| Módulo | Cobertura |
|--------|-----------|
| `loginSchema` | E-mail inválido, senha curta, campos obrigatórios |
| `registerSchema` | Nome, e-mail, senha, confirmação |
| `addCartItemSchema` | productId obrigatório, quantidade min/max |
| `updateCartItemSchema` | Quantidade min/max |
| `createProductSchema` | Nome, descrição, preço, imageUrl URL válida, categoryId |
| `updateProductSchema` | Campos opcionais, active boolean |
| `deliveryAddressSchema` | CEP formato, estado 2 chars, campos obrigatórios |
| `createOrderSchema` | Endereço completo, paymentMethod |
| `updateOrderStatusSchema` | Status válido do enum |

---

## 5. Testes de Integração

Requerem PostgreSQL em execução (`npm run db:up`).
Implementados com `it.skipIf(!isDbAvailable)` para ambientes sem banco.

### 5.1 `auth.integration` — 2 casos

| ID | Cenário | Resultado esperado |
|----|---------|-------------------|
| AI01 | Registrar usuário via service com DB real | Persistido com hash bcrypt |
| AI02 | Registrar e-mail duplicado no banco | ConflictError lançado |

### 5.2 `products.integration` — 4 casos

| ID | Cenário | Resultado esperado |
|----|---------|-------------------|
| PI01 | Criar produto com categoria real | Produto persistido |
| PI02 | Buscar produto por ID | Retorna DTO correto |
| PI03 | Listar produtos com filtro por categoria | Apenas produtos da categoria |
| PI04 | Desativar produto | `active = false` no banco |

### 5.3 `orders.integration` — 5 casos

| ID | Cenário | Resultado esperado |
|----|---------|-------------------|
| OI01 | Criar pedido completo com itens | Order + OrderItems + Payment persistidos |
| OI02 | Verificar snapshot de preço | unitPrice = preço do produto no momento |
| OI03 | Verificar total calculado no servidor | total = sum(qty × price) |
| OI04 | Buscar pedido por userId | Retorna pedido correto |
| OI05 | Negar acesso a pedido de outro usuário | NotFoundError lançado |

---

## 6. Testes End-to-End (Playwright)

Executados em Chrome Desktop e Chrome Mobile (Pixel 5).
Requerem servidor em execução (`npm run dev`) e seed do banco.

### 6.1 `auth.spec` — 8 casos

| ID | Fluxo |
|----|-------|
| E2E-AU01 | Exibir página de login com campos corretos |
| E2E-AU02 | Exibir página de cadastro |
| E2E-AU03 | Erro para credenciais inválidas |
| E2E-AU04 | Login com credenciais do seed |
| E2E-AU05 | Cadastro de novo cliente |
| E2E-AU06 | Rota /checkout protegida sem login |
| E2E-AU07 | Rota /admin protegida sem login |
| E2E-AU08 | Acesso a /admin bloqueado para CUSTOMER |

### 6.2 `catalog.spec` — 7 casos

| ID | Fluxo |
|----|-------|
| E2E-CA01 | Página inicial exibe hero e link para cardápio |
| E2E-CA02 | Catálogo lista produtos do seed |
| E2E-CA03 | Filtro por categoria atualiza URL |
| E2E-CA04 | Busca por nome com debounce |
| E2E-CA05 | Navegação para detalhe do produto |
| E2E-CA06 | Preços no formato R$ XX,XX |
| E2E-CA07 | Produto inexistente exibe 404 |

### 6.3 `checkout.spec` — 5 casos

| ID | Fluxo |
|----|-------|
| E2E-CH01 | Adicionar produto ao carrinho logado |
| E2E-CH02 | Visualizar carrinho com itens |
| E2E-CH03 | Formulário de checkout com campos corretos |
| E2E-CH04 | Finalizar pedido e ver confirmação |
| E2E-CH05 | Listar pedido em Meus Pedidos |

### 6.4 `admin.spec` — 7 casos

| ID | Fluxo |
|----|-------|
| E2E-AD01 | Dashboard exibe KPIs |
| E2E-AD02 | Listagem de produtos com seed |
| E2E-AD03 | Formulário de novo produto |
| E2E-AD04 | Criar produto via formulário |
| E2E-AD05 | Listar pedidos |
| E2E-AD06 | Filtrar pedidos por status |
| E2E-AD07 | Sidebar destaca rota ativa |

---

## 7. Critérios de aprovação

| Nível | Critério |
|-------|---------|
| Unitário | 100% dos testes passam |
| Integração | Todos passam quando banco disponível; skipIf quando não |
| E2E | 100% passam com servidor + seed em execução |
| Cobertura mínima | Módulos de serviço com ≥ 80% de cobertura de linhas |

---

## 8. Execução

```bash
# Testes unitários
npm run test

# Testes unitários com cobertura
npm run test:coverage

# Testes de integração (requer banco)
npm run db:up && npx vitest run tests/integration

# Testes E2E (requer servidor + banco + seed)
npm run db:up && npm run db:seed
npm run dev  # terminal separado
npx playwright test
npx playwright show-report  # visualizar relatório HTML
```
