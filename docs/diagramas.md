# Diagramas — Cupcake Gourmet
**Projeto Integrador Transdisciplinar em Engenharia de Software II**
**Aluno:** Murilo Bandeira Gruppi — RGM 34169679

---

## 1. Diagrama de Casos de Uso

```mermaid
graph TD
  Actor_Cliente([👤 Cliente])
  Actor_Admin([👤 Administrador])
  Actor_Sistema([⚙️ Sistema])

  subgraph UC_Auth["Autenticação"]
    UC01["UC01 — Cadastrar conta"]
    UC02["UC02 — Fazer login"]
    UC03["UC03 — Encerrar sessão"]
  end

  subgraph UC_Catalogo["Catálogo"]
    UC04["UC04 — Visualizar catálogo"]
    UC05["UC05 — Buscar produtos"]
    UC06["UC06 — Filtrar por categoria"]
    UC07["UC07 — Ver detalhe do produto"]
  end

  subgraph UC_Carrinho["Carrinho"]
    UC08["UC08 — Adicionar produto ao carrinho"]
    UC09["UC09 — Alterar quantidade"]
    UC10["UC10 — Remover produto"]
    UC11["UC11 — Visualizar carrinho"]
  end

  subgraph UC_Compra["Compra"]
    UC12["UC12 — Preencher endereço de entrega"]
    UC13["UC13 — Selecionar forma de pagamento"]
    UC14["UC14 — Confirmar pedido"]
    UC15["UC15 — Consultar meus pedidos"]
    UC16["UC16 — Ver detalhe do pedido"]
  end

  subgraph UC_Admin["Administração"]
    UC17["UC17 — Ver dashboard"]
    UC18["UC18 — Listar produtos"]
    UC19["UC19 — Criar produto"]
    UC20["UC20 — Editar produto"]
    UC21["UC21 — Desativar produto"]
    UC22["UC22 — Listar pedidos"]
    UC23["UC23 — Ver detalhe do pedido"]
    UC24["UC24 — Atualizar status do pedido"]
  end

  Actor_Cliente --> UC01
  Actor_Cliente --> UC02
  Actor_Cliente --> UC03
  Actor_Cliente --> UC04
  Actor_Cliente --> UC05
  Actor_Cliente --> UC06
  Actor_Cliente --> UC07
  Actor_Cliente --> UC08
  Actor_Cliente --> UC09
  Actor_Cliente --> UC10
  Actor_Cliente --> UC11
  Actor_Cliente --> UC12
  Actor_Cliente --> UC13
  Actor_Cliente --> UC14
  Actor_Cliente --> UC15
  Actor_Cliente --> UC16

  Actor_Admin --> UC02
  Actor_Admin --> UC03
  Actor_Admin --> UC17
  Actor_Admin --> UC18
  Actor_Admin --> UC19
  Actor_Admin --> UC20
  Actor_Admin --> UC21
  Actor_Admin --> UC22
  Actor_Admin --> UC23
  Actor_Admin --> UC24

  UC14 --> UC15
  UC08 -.->|"<<include>>"| UC02
```

---

## 2. Diagrama de Classes

```mermaid
classDiagram
  class User {
    +String id
    +String name
    +String email
    +String passwordHash
    +Role role
    +DateTime createdAt
    +DateTime updatedAt
    +register(name, email, password) User
    +authenticate(email, password) Session
  }

  class Category {
    +String id
    +String name
    +String description
  }

  class Product {
    +String id
    +String name
    +String description
    +Decimal price
    +String? imageUrl
    +String categoryId
    +Boolean active
    +DateTime createdAt
    +DateTime updatedAt
    +activate() void
    +deactivate() void
    +toDTO() ProductDTO
  }

  class Cart {
    +String id
    +String userId
    +DateTime createdAt
    +DateTime updatedAt
    +addItem(productId, qty) CartItem
    +updateItem(itemId, qty) CartItem
    +removeItem(itemId) void
    +clear() void
    +getTotal() Decimal
  }

  class CartItem {
    +String id
    +String cartId
    +String productId
    +Int quantity
  }

  class Order {
    +String id
    +String userId
    +Decimal total
    +OrderStatus status
    +PaymentStatus paymentStatus
    +Json deliveryAddress
    +DateTime createdAt
    +DateTime updatedAt
    +updateStatus(status) void
  }

  class OrderItem {
    +String id
    +String orderId
    +String productId
    +String productName
    +Int quantity
    +Decimal unitPrice
    +Decimal subtotal
  }

  class Payment {
    +String id
    +String orderId
    +String provider
    +String? externalReference
    +Decimal amount
    +PaymentStatus status
    +DateTime createdAt
  }

  class Role {
    <<enumeration>>
    CUSTOMER
    ADMIN
  }

  class OrderStatus {
    <<enumeration>>
    PENDING
    CONFIRMED
    PREPARING
    OUT_FOR_DELIVERY
    COMPLETED
    CANCELED
  }

  class PaymentStatus {
    <<enumeration>>
    PENDING
    APPROVED
    REJECTED
    REFUNDED
  }

  User "1" --> "0..1" Cart : possui
  User "1" --> "0..*" Order : realiza
  Cart "1" --> "0..*" CartItem : contém
  CartItem "0..*" --> "1" Product : referencia
  Order "1" --> "1..*" OrderItem : contém
  OrderItem "0..*" --> "1" Product : referencia
  Order "1" --> "0..*" Payment : possui
  Product "0..*" --> "1" Category : pertence
  User --> Role
  Order --> OrderStatus
  Order --> PaymentStatus
  Payment --> PaymentStatus
```

---

## 3. Diagrama de Sequência — Fluxo de Compra

```mermaid
sequenceDiagram
  actor Cliente
  participant Browser as Browser (React)
  participant API as API (Next.js)
  participant Service as OrderService
  participant DB as PostgreSQL

  Cliente->>Browser: Clica "Confirmar e Pagar"
  Browser->>API: POST /api/orders { deliveryAddress, paymentMethod }
  API->>API: auth() → verifica sessão JWT
  alt Sessão inválida
    API-->>Browser: 401 Não autorizado
    Browser-->>Cliente: Redireciona para /login
  end
  API->>Service: createWithItems(userId, input)
  Service->>DB: SELECT cart + cartItems WHERE userId
  DB-->>Service: Itens do carrinho
  Service->>DB: SELECT products WHERE id IN (...)
  Note over Service: Consulta preços no banco (RN04/RN05)<br/>Nunca confia no preço do cliente
  DB-->>Service: Preços atuais dos produtos
  Service->>Service: Calcula total server-side (RN07)
  Service->>DB: BEGIN TRANSACTION
  DB-->>Service: Transaction iniciada
  Service->>DB: INSERT Order
  Service->>DB: INSERT OrderItems (com snapshot de preço)
  Service->>DB: INSERT Payment (status=PENDING)
  Service->>DB: Simula aprovação do provedor
  Service->>DB: UPDATE Payment SET status=APPROVED
  Service->>DB: UPDATE Order SET paymentStatus=APPROVED
  Service->>DB: DELETE CartItems (limpa carrinho)
  Service->>DB: COMMIT
  DB-->>Service: Sucesso
  Service-->>API: Order criada
  API-->>Browser: 201 { data: { id: orderId } }
  Browser-->>Cliente: Redireciona para /orders/{id}?success=true
```

---

## 4. Diagrama de Sequência — Autenticação

```mermaid
sequenceDiagram
  actor Usuário
  participant Browser
  participant NextAuth as NextAuth (Credentials)
  participant Service as AuthService
  participant DB as PostgreSQL

  Usuário->>Browser: Preenche e-mail e senha
  Browser->>NextAuth: POST /api/auth/callback/credentials
  NextAuth->>Service: authorize({ email, password })
  Service->>DB: SELECT user WHERE email = ?
  DB-->>Service: User ou null
  alt Usuário não encontrado
    Service-->>NextAuth: return null
    NextAuth-->>Browser: 401
    Browser-->>Usuário: "E-mail ou senha incorretos."
  end
  Service->>Service: bcrypt.compare(password, passwordHash)
  alt Senha incorreta
    Service-->>NextAuth: return null
    NextAuth-->>Browser: 401
    Browser-->>Usuário: "E-mail ou senha incorretos."
  end
  Service-->>NextAuth: { id, name, email, role }
  NextAuth->>NextAuth: Gera JWT com { sub, role }
  NextAuth-->>Browser: Set-Cookie: next-auth.session-token (JWT)
  Browser-->>Usuário: Redireciona para / (ou callbackUrl)
```

---

## 5. Diagrama de Atividades — Finalização de Pedido

```mermaid
flowchart TD
  A([Início]) --> B[Cliente acessa /checkout]
  B --> C{Está autenticado?}
  C -- Não --> D[Redireciona para /login]
  D --> E[Faz login] --> B
  C -- Sim --> F{Carrinho tem itens?}
  F -- Não --> G[Redireciona para /products]
  F -- Sim --> H[Exibe formulário de checkout]
  H --> I[Preenche endereço e forma de pagamento]
  I --> J[Clica em Confirmar e Pagar]
  J --> K[Validação client-side do formulário]
  K --> L{Dados válidos?}
  L -- Não --> M[Exibe erros nos campos] --> I
  L -- Sim --> N[POST /api/orders]
  N --> O[Verifica sessão no servidor]
  O --> P[Consulta carrinho no banco]
  P --> Q{Carrinho não-vazio?}
  Q -- Não --> R[Retorna 400 Bad Request] --> S[Exibe mensagem de erro]
  Q -- Sim --> T[Consulta preços no banco]
  T --> U[Calcula total server-side]
  U --> V[Inicia transação no banco]
  V --> W[Cria Order + OrderItems]
  W --> X[Processa pagamento via provider]
  X --> Y{Pagamento aprovado?}
  Y -- Não --> Z[Atualiza paymentStatus=REJECTED]
  Z --> AA[ROLLBACK / mantém pedido como REJECTED]
  Y -- Sim --> AB[Atualiza paymentStatus=APPROVED]
  AB --> AC[Limpa carrinho]
  AC --> AD[COMMIT]
  AD --> AE[Retorna 201 com orderId]
  AE --> AF[Redireciona para /orders/{id}?success=true]
  AF --> AG([Fim])
```

---

## 6. Modelo Entidade-Relacionamento (MER)

```mermaid
erDiagram
  USERS {
    string id PK
    string name
    string email UK
    string passwordHash
    string role
    datetime createdAt
    datetime updatedAt
  }

  CATEGORIES {
    string id PK
    string name UK
    string description
  }

  PRODUCTS {
    string id PK
    string name
    string description
    decimal price
    string imageUrl
    string categoryId FK
    boolean active
    datetime createdAt
    datetime updatedAt
  }

  CARTS {
    string id PK
    string userId FK
    datetime createdAt
    datetime updatedAt
  }

  CART_ITEMS {
    string id PK
    string cartId FK
    string productId FK
    int quantity
  }

  ORDERS {
    string id PK
    string userId FK
    decimal total
    string status
    string paymentStatus
    json deliveryAddress
    datetime createdAt
    datetime updatedAt
  }

  ORDER_ITEMS {
    string id PK
    string orderId FK
    string productId FK
    string productName
    int quantity
    decimal unitPrice
    decimal subtotal
  }

  PAYMENTS {
    string id PK
    string orderId FK
    string provider
    string externalReference
    decimal amount
    string status
    datetime createdAt
  }

  USERS ||--o| CARTS : "possui"
  USERS ||--o{ ORDERS : "realiza"
  CATEGORIES ||--o{ PRODUCTS : "classifica"
  CARTS ||--o{ CART_ITEMS : "contém"
  PRODUCTS ||--o{ CART_ITEMS : "é referenciado em"
  ORDERS ||--|{ ORDER_ITEMS : "contém"
  PRODUCTS ||--o{ ORDER_ITEMS : "é referenciado em"
  ORDERS ||--o{ PAYMENTS : "possui"
```
