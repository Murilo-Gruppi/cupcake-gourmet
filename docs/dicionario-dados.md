# Dicionário de Dados — Cupcake Gourmet
**Projeto Integrador Transdisciplinar em Engenharia de Software II**
**Aluno:** Murilo Bandeira Gruppi — RGM 34169679

---

## Tabela: `users`

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | `VARCHAR` | PK, NOT NULL | Identificador único gerado via CUID |
| `name` | `VARCHAR` | NOT NULL | Nome completo do usuário |
| `email` | `VARCHAR` | NOT NULL, UNIQUE | E-mail de acesso — usado como login |
| `passwordHash` | `VARCHAR` | NOT NULL | Hash bcrypt (cost=12) da senha |
| `role` | `ENUM(Role)` | NOT NULL, DEFAULT `CUSTOMER` | Perfil de acesso: `CUSTOMER` ou `ADMIN` |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Data e hora de criação |
| `updatedAt` | `TIMESTAMP` | NOT NULL, auto-atualizado | Data e hora da última atualização |

**Índices:** `users_email_key` (UNIQUE em `email`)

---

## Tabela: `categories`

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | `VARCHAR` | PK, NOT NULL | Identificador único gerado via CUID |
| `name` | `VARCHAR` | NOT NULL, UNIQUE | Nome da categoria (ex: "Clássicos") |
| `description` | `VARCHAR` | NULL | Descrição da categoria |

**Índices:** `categories_name_key` (UNIQUE em `name`)

---

## Tabela: `products`

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | `VARCHAR` | PK, NOT NULL | Identificador único |
| `name` | `VARCHAR` | NOT NULL | Nome do produto |
| `description` | `TEXT` | NOT NULL | Descrição detalhada |
| `price` | `DECIMAL(10,2)` | NOT NULL | Preço em reais — tipo Decimal evita erro de ponto flutuante |
| `imageUrl` | `VARCHAR` | NULL | URL externa da imagem do produto |
| `categoryId` | `VARCHAR` | NOT NULL, FK → `categories.id` | Categoria do produto |
| `active` | `BOOLEAN` | NOT NULL, DEFAULT `true` | Indica se o produto está disponível no catálogo |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Data de cadastro |
| `updatedAt` | `TIMESTAMP` | NOT NULL, auto-atualizado | Data da última edição |

**Regra de negócio:** Produtos são desativados (`active = false`) em vez de excluídos, para preservar histórico de pedidos (RN11).

---

## Tabela: `carts`

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | `VARCHAR` | PK, NOT NULL | Identificador único |
| `userId` | `VARCHAR` | NOT NULL, UNIQUE, FK → `users.id` | Proprietário do carrinho — um por usuário |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Data de criação |
| `updatedAt` | `TIMESTAMP` | NOT NULL, auto-atualizado | Data da última modificação |

**Índices:** `carts_userId_key` (UNIQUE — garante 1 carrinho por usuário)

---

## Tabela: `cart_items`

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | `VARCHAR` | PK, NOT NULL | Identificador único |
| `cartId` | `VARCHAR` | NOT NULL, FK → `carts.id` | Carrinho ao qual pertence |
| `productId` | `VARCHAR` | NOT NULL, FK → `products.id` | Produto adicionado |
| `quantity` | `INTEGER` | NOT NULL, DEFAULT 1, CHECK ≥ 1 | Quantidade do produto |

**Índices:** `cart_items_cartId_productId_key` (UNIQUE — impede duplicatas, força merge via upsert)

---

## Tabela: `orders`

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | `VARCHAR` | PK, NOT NULL | Identificador único |
| `userId` | `VARCHAR` | NOT NULL, FK → `users.id` | Cliente que realizou o pedido |
| `total` | `DECIMAL(10,2)` | NOT NULL | Valor total calculado pelo servidor (RN07) |
| `status` | `ENUM(OrderStatus)` | NOT NULL, DEFAULT `PENDING` | Status operacional do pedido |
| `paymentStatus` | `ENUM(PaymentStatus)` | NOT NULL, DEFAULT `PENDING` | Status do pagamento (cache denormalizado) |
| `deliveryAddress` | `JSONB` | NOT NULL | Endereço de entrega: `{ street, number, complement?, neighborhood, city, state, zipCode }` |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Data e hora do pedido |
| `updatedAt` | `TIMESTAMP` | NOT NULL, auto-atualizado | Data da última atualização |

**Enumeração OrderStatus:** `PENDING` → `CONFIRMED` → `PREPARING` → `OUT_FOR_DELIVERY` → `COMPLETED` | `CANCELED`

---

## Tabela: `order_items`

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | `VARCHAR` | PK, NOT NULL | Identificador único |
| `orderId` | `VARCHAR` | NOT NULL, FK → `orders.id` | Pedido ao qual pertence |
| `productId` | `VARCHAR` | NOT NULL, FK → `products.id` | Produto comprado |
| `productName` | `VARCHAR` | NOT NULL | **Snapshot** do nome no momento da compra (RN05) |
| `quantity` | `INTEGER` | NOT NULL | Quantidade comprada |
| `unitPrice` | `DECIMAL(10,2)` | NOT NULL | **Snapshot** do preço unitário no momento da compra (RN05) |
| `subtotal` | `DECIMAL(10,2)` | NOT NULL | `quantity × unitPrice` — calculado pelo servidor |

**Regra de negócio:** `productName` e `unitPrice` são copiados do produto no momento do checkout para garantir integridade histórica, independente de edições futuras no produto (RN05).

---

## Tabela: `payments`

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | `VARCHAR` | PK, NOT NULL | Identificador único |
| `orderId` | `VARCHAR` | NOT NULL, FK → `orders.id` | Pedido associado |
| `provider` | `VARCHAR` | NOT NULL | Nome do provedor (ex: `"demo"`, `"demo_pix"`) |
| `externalReference` | `VARCHAR` | NULL | ID gerado pelo gateway de pagamento externo |
| `amount` | `DECIMAL(10,2)` | NOT NULL | Valor processado |
| `status` | `ENUM(PaymentStatus)` | NOT NULL | Status do pagamento |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT `now()` | Data do processamento |

**Enumeração PaymentStatus:** `PENDING` | `APPROVED` | `REJECTED` | `REFUNDED`

---

## Enumerações

### `Role`
| Valor | Descrição |
|-------|-----------|
| `CUSTOMER` | Cliente final — acesso ao catálogo, carrinho e pedidos próprios |
| `ADMIN` | Administrador — acesso completo ao painel de gerenciamento |

### `OrderStatus`
| Valor | Descrição |
|-------|-----------|
| `PENDING` | Pedido recebido, aguardando confirmação |
| `CONFIRMED` | Pedido confirmado pelo estabelecimento |
| `PREPARING` | Pedido em preparo na cozinha |
| `OUT_FOR_DELIVERY` | Pedido saiu para entrega |
| `COMPLETED` | Pedido entregue ao cliente |
| `CANCELED` | Pedido cancelado |

### `PaymentStatus`
| Valor | Descrição |
|-------|-----------|
| `PENDING` | Pagamento aguardando processamento |
| `APPROVED` | Pagamento aprovado |
| `REJECTED` | Pagamento recusado |
| `REFUNDED` | Pagamento estornado |
