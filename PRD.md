# PRD — Cupcake Gourmet
## Plataforma de vendas online e gerenciamento de pedidos

**Projeto:** Projeto Integrador Transdisciplinar em Engenharia de Software II  
**Aluno:** Murilo Bandeira Gruppi  
**RGM:** 34169679  
**Versão:** 1.0  
**Status:** Especificação inicial

---

# 1. Visão geral

## 1.1 Contexto

Uma loja de cupcakes gourmet deseja expandir sua atuação comercial por meio de vendas digitais.

O projeto anterior de desenvolvimento de um aplicativo fracassou devido a problemas no levantamento de requisitos e ao desalinhamento entre as necessidades do negócio e a solução entregue.

O objetivo deste projeto é desenvolver uma aplicação web responsiva, com experiência otimizada para dispositivos móveis, que permita aos clientes consultar produtos, realizar compras e acompanhar pedidos.

A solução também deverá disponibilizar um painel administrativo para gerenciamento de produtos e pedidos.

## 1.2 Objetivo do produto

Desenvolver uma plataforma digital de comércio eletrônico para uma loja de cupcakes gourmet, proporcionando:

- Facilidade na consulta e escolha de produtos.
- Processo de compra simples e intuitivo.
- Registro e acompanhamento de pedidos.
- Gerenciamento centralizado do catálogo.
- Controle operacional dos pedidos.
- Experiência consistente em dispositivos móveis e desktops.

## 1.3 Público-alvo

**Cliente final:** pessoas interessadas em comprar cupcakes gourmet para consumo próprio, presentes ou eventos.

**Administrador:** responsável pela operação da loja, manutenção do catálogo e acompanhamento das vendas.

---

# 2. Escopo funcional

## 2.1 Módulo de autenticação

Permitir que clientes criem contas e acessem a plataforma.

Funcionalidades:

- Cadastro de clientes.
- Login com e-mail e senha.
- Logout.
- Recuperação de senha, caso haja serviço de envio configurado.
- Controle de acesso por perfil.
- Proteção de rotas administrativas.

Perfis:

- CUSTOMER
- ADMIN

## 2.2 Catálogo de produtos

Disponibilizar os produtos comercializados pela loja.

Cada produto deverá possuir:

- Identificador.
- Nome.
- Descrição.
- Preço.
- Imagem.
- Categoria.
- Disponibilidade.
- Data de cadastro.
- Data de atualização.

Funcionalidades:

- Listagem de produtos.
- Visualização detalhada.
- Pesquisa por nome.
- Filtro por categoria.
- Exibição de preço.
- Identificação de produtos indisponíveis.

## 2.3 Carrinho de compras

Permitir que o cliente selecione produtos e organize sua compra.

Funcionalidades:

- Adicionar produtos.
- Remover produtos.
- Alterar quantidades.
- Calcular subtotal.
- Calcular total.
- Persistir carrinho durante a navegação.

Regras:

- Não permitir quantidade inferior a 1.
- Não permitir adicionar produtos indisponíveis.
- Recalcular valores no servidor.
- Nunca confiar no preço enviado pelo navegador.

## 2.4 Checkout

Permitir a conclusão de uma compra.

Informações necessárias:

- Identificação do cliente.
- Endereço de entrega.
- Produtos selecionados.
- Quantidades.
- Valor total.
- Forma de pagamento.

O sistema deverá:

1. Validar o carrinho.
2. Consultar os preços atuais no banco.
3. Validar a disponibilidade dos produtos.
4. Registrar o pedido.
5. Registrar os itens do pedido.
6. Registrar a situação inicial do pagamento.
7. Apresentar confirmação ao cliente.

O pagamento deverá utilizar uma abstração de provedor, permitindo inicialmente um modo demonstrativo e, opcionalmente, integração com ambiente sandbox de um gateway.

Não armazenar dados de cartão de crédito.

## 2.5 Gerenciamento de pedidos

Clientes poderão consultar seus pedidos.

Informações:

- Número do pedido.
- Data de realização.
- Produtos adquiridos.
- Quantidades.
- Valor total.
- Endereço.
- Status do pedido.
- Status do pagamento.

Status possíveis:

- PENDING
- CONFIRMED
- PREPARING
- OUT_FOR_DELIVERY
- COMPLETED
- CANCELED

O cliente poderá visualizar somente os pedidos associados à própria conta.

## 2.6 Painel administrativo

Disponibilizar uma área restrita para administração da loja.

Funcionalidades:

- Visualização de indicadores básicos.
- Listagem de produtos.
- Cadastro de produtos.
- Edição de produtos.
- Desativação de produtos.
- Visualização de pedidos.
- Consulta de detalhes.
- Atualização de status.
- Consulta do histórico de pedidos.

---

# 3. Requisitos funcionais

| ID | Requisito |
|---|---|
| RF001 | O sistema deve permitir o cadastro de clientes. |
| RF002 | O sistema deve permitir autenticação. |
| RF003 | O sistema deve permitir encerramento de sessão. |
| RF004 | O sistema deve apresentar catálogo de produtos. |
| RF005 | O sistema deve permitir pesquisa e filtragem de produtos. |
| RF006 | O sistema deve apresentar detalhes dos produtos. |
| RF007 | O sistema deve permitir adicionar produtos ao carrinho. |
| RF008 | O sistema deve permitir alterar quantidades. |
| RF009 | O sistema deve permitir remover produtos do carrinho. |
| RF010 | O sistema deve calcular o valor total da compra. |
| RF011 | O sistema deve permitir finalizar pedidos. |
| RF012 | O sistema deve registrar pedidos e seus respectivos itens. |
| RF013 | O sistema deve disponibilizar consulta de pedidos ao cliente. |
| RF014 | O sistema deve permitir gerenciamento de produtos pelo administrador. |
| RF015 | O sistema deve permitir gerenciamento de pedidos pelo administrador. |
| RF016 | O sistema deve permitir atualização do status dos pedidos. |
| RF017 | O sistema deve restringir funcionalidades administrativas. |
| RF018 | O sistema deve registrar a situação do pagamento. |

---

# 4. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF001 | A aplicação deve ser responsiva. |
| RNF002 | A interface deve priorizar a experiência mobile. |
| RNF003 | O sistema deve utilizar HTTPS em produção. |
| RNF004 | Senhas devem ser armazenadas utilizando hash seguro. |
| RNF005 | Dados persistentes devem ser armazenados em PostgreSQL. |
| RNF006 | O acesso ao banco deve ocorrer exclusivamente pelo servidor. |
| RNF007 | Rotas administrativas devem exigir autorização. |
| RNF008 | Dados de entrada devem ser validados no servidor. |
| RNF009 | A aplicação deve apresentar mensagens claras de erro. |
| RNF010 | O código deve possuir separação de responsabilidades. |
| RNF011 | A aplicação deve possuir testes automatizados. |
| RNF012 | O banco deve possuir integridade referencial. |
| RNF013 | A documentação técnica deve permanecer versionada. |

---

# 5. Arquitetura da solução

## 5.1 Arquitetura geral

A solução utilizará uma arquitetura monolítica modular, com Next.js responsável pelo front-end e back-end.

O Next.js App Router será utilizado para páginas, layouts e Route Handlers.

A aplicação deverá implementar separação de responsabilidades inspirada no padrão MVC.

## 5.2 Tecnologias

- Next.js com App Router.
- TypeScript.
- React.
- Tailwind CSS.
- shadcn/ui.
- PostgreSQL.
- Prisma ORM.
- Docker Compose.
- Zod.
- Vitest.
- Playwright.
- Git e GitHub.

## 5.3 Organização arquitetural

**Presentation Layer**
- Páginas.
- Componentes.
- Formulários.
- Layouts.
- Interface administrativa.

**Controller Layer**
- Route Handlers.
- Recebimento de requisições.
- Validação de parâmetros.
- Respostas HTTP.

**Service Layer**
- Regras de negócio.
- Processamento de pedidos.
- Cálculo de valores.
- Validação de disponibilidade.
- Autorização de operações.

**Repository Layer**
- Consultas ao banco.
- Persistência.
- Atualização de registros.
- Operações transacionais.

**Persistence Layer**
- Prisma.
- PostgreSQL.

O acesso ao banco de dados nunca deverá ser realizado diretamente por componentes client-side.

## 5.4 Estrutura sugerida de diretórios

```text
cupcake-gourmet/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── (store)/
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── orders/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── admin/
│   │   │   ├── products/
│   │   │   └── orders/
│   │   └── api/
│   │       ├── products/
│   │       ├── cart/
│   │       ├── orders/
│   │       ├── auth/
│   │       └── admin/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── products/
│   │   ├── cart/
│   │   └── orders/
│   ├── modules/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── payments/
│   │   └── cart/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── validations/
│   │   └── utils/
│   └── types/
├── docs/
├── tests/
│   ├── unit/
│   └── e2e/
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── package.json
└── README.md
```

---

# 6. Modelagem de dados

## 6.1 Entidades

### User
Representa os usuários da plataforma.

Atributos:
- id
- name
- email
- passwordHash
- role
- createdAt
- updatedAt

### Product
Representa os produtos comercializados.

Atributos:
- id
- name
- description
- price
- imageUrl
- categoryId
- active
- createdAt
- updatedAt

### Category
Representa as categorias de produtos.

Atributos:
- id
- name
- description

### Cart
Representa o carrinho de compras de um cliente.

Atributos:
- id
- userId
- createdAt
- updatedAt

### CartItem
Representa os produtos adicionados ao carrinho.

Atributos:
- id
- cartId
- productId
- quantity

### Order
Representa um pedido realizado.

Atributos:
- id
- userId
- total
- status
- paymentStatus
- deliveryAddress
- createdAt
- updatedAt

### OrderItem
Representa os produtos de um pedido.

Atributos:
- id
- orderId
- productId
- productName
- quantity
- unitPrice
- subtotal

### Payment
Representa o registro do pagamento.

Atributos:
- id
- orderId
- provider
- externalReference
- amount
- status
- createdAt

## 6.2 Relacionamentos

- User 1:N Order
- User 1:1 Cart
- Cart 1:N CartItem
- Product 1:N CartItem
- Category 1:N Product
- Order 1:N OrderItem
- Product 1:N OrderItem
- Order 1:N Payment

O modelo físico deverá possuir chaves primárias, estrangeiras, restrições de unicidade e índices adequados.

Os preços deverão utilizar tipo decimal, evitando erros de precisão de ponto flutuante.

---

# 7. API — Contratos iniciais

| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/products | Listar produtos |
| GET | /api/products/:id | Consultar produto |
| POST | /api/auth/register | Cadastrar cliente |
| POST | /api/auth/login | Autenticar |
| GET | /api/cart | Consultar carrinho |
| POST | /api/cart/items | Adicionar item |
| PATCH | /api/cart/items/:id | Alterar quantidade |
| DELETE | /api/cart/items/:id | Remover item |
| POST | /api/orders | Criar pedido |
| GET | /api/orders | Listar pedidos do cliente |
| GET | /api/orders/:id | Consultar pedido |
| GET | /api/admin/products | Listar produtos administrativos |
| POST | /api/admin/products | Criar produto |
| PATCH | /api/admin/products/:id | Atualizar produto |
| DELETE | /api/admin/products/:id | Desativar produto |
| GET | /api/admin/orders | Listar todos os pedidos |
| PATCH | /api/admin/orders/:id/status | Atualizar status |

Todas as rotas administrativas deverão validar o perfil do usuário no servidor.

---

# 8. Regras de negócio

**RN01:** Somente clientes autenticados poderão finalizar pedidos.

**RN02:** Somente administradores poderão gerenciar produtos e pedidos.

**RN03:** Produtos inativos não poderão ser adicionados ao carrinho.

**RN04:** O preço deverá ser consultado no banco durante a finalização da compra.

**RN05:** O pedido deverá armazenar o preço histórico dos produtos.

**RN06:** Um pedido deverá possuir pelo menos um item.

**RN07:** O valor total deverá ser calculado pelo servidor.

**RN08:** O cliente somente poderá consultar seus próprios pedidos.

**RN09:** As operações de criação do pedido e de seus itens deverão ocorrer em uma transação de banco de dados.

**RN10:** O sistema deverá impedir quantidades inválidas ou negativas.

**RN11:** A desativação de um produto não deverá excluir seu histórico de vendas.

**RN12:** A confirmação de pagamento não poderá ocorrer apenas pela resposta do navegador. Em uma integração real, deverá ser validada pelo servidor.

---

# 9. Interface e experiência do usuário

A aplicação deverá possuir identidade visual relacionada a uma confeitaria gourmet.

Diretrizes:

- Design clean e elegante.
- Cores suaves e tons de confeitaria.
- Tipografia legível.
- Fotografias de produtos em destaque.
- Navegação intuitiva.
- Botões de ação evidentes.
- Feedback visual para operações.
- Estados de carregamento.
- Estados vazios.
- Mensagens de erro contextualizadas.

## Telas necessárias

1. Página inicial.
2. Catálogo de produtos.
3. Detalhes do produto.
4. Login.
5. Cadastro.
6. Carrinho.
7. Checkout.
8. Confirmação do pedido.
9. Meus pedidos.
10. Detalhes do pedido.
11. Dashboard administrativo.
12. Gerenciamento de produtos.
13. Gerenciamento de pedidos.

---

# 10. Estratégia de testes

## 10.1 Testes unitários

Utilizar Vitest para testar:

- Cálculo de valores.
- Validação de quantidades.
- Regras de negócio.
- Serviços de pedidos.
- Validação de dados.
- Controle de permissões.

## 10.2 Testes de integração

Validar:

- Persistência de usuários.
- Consulta de produtos.
- Criação de pedidos.
- Persistência dos itens.
- Integridade dos relacionamentos.
- Transações.
- Autorização de operações.

## 10.3 Testes end-to-end

Utilizar Playwright para testar:

- Cadastro de cliente.
- Autenticação.
- Consulta de produtos.
- Adição ao carrinho.
- Finalização da compra.
- Consulta do histórico.
- Acesso administrativo.
- Gerenciamento de produtos.
- Atualização de pedidos.

## 10.4 Testes com usuários

Cinco colegas deverão avaliar a solução.

Cada avaliador deverá:

1. Acessar a aplicação.
2. Navegar pelo catálogo.
3. Selecionar produtos.
4. Adicionar produtos ao carrinho.
5. Simular uma compra.
6. Consultar o pedido.
7. Avaliar a facilidade de utilização.

Os feedbacks deverão ser registrados e classificados em:

- Problemas funcionais.
- Problemas de usabilidade.
- Problemas visuais.
- Sugestões de melhoria.

As correções deverão ser implementadas e testadas novamente.

---

# 11. Infraestrutura e execução

O PostgreSQL deverá ser executado por Docker Compose.

A infraestrutura local deverá permitir:

- Inicialização do banco.
- Persistência por volume.
- Configuração por variáveis de ambiente.
- Execução de migrations.
- Carga inicial de dados.
- Conexão da aplicação com o banco.

A aplicação poderá ser executada localmente por meio de `npm run dev`.

O repositório deverá conter instruções completas para reprodução do ambiente.

---

# 12. Entregáveis acadêmicos

O projeto deverá conter:

1. PRD.
2. Especificação de requisitos.
3. Diagrama de casos de uso.
4. Diagrama de classes.
5. Diagrama de sequência.
6. Diagrama de atividades.
7. Modelo entidade-relacionamento.
8. Dicionário de dados.
9. Scripts e migrations do banco.
10. Código-fonte do front-end.
11. Código-fonte do back-end.
12. Manual de utilização.
13. Plano de testes.
14. Evidências dos testes.
15. Avaliações de cinco colegas.
16. Laudo de qualidade.
17. Registro das melhorias realizadas.
18. Repositório GitHub.
19. Vídeo narrado de pelo menos cinco minutos.
20. Vídeo demonstrando as modificações após os testes.

---

# 13. Critérios de aceite do projeto

O projeto será considerado funcional quando:

- [ ] A aplicação iniciar seguindo o README.
- [ ] O PostgreSQL funcionar via Docker.
- [ ] As migrations forem executadas corretamente.
- [ ] O catálogo apresentar produtos persistidos.
- [ ] Clientes conseguirem se cadastrar e autenticar.
- [ ] Clientes conseguirem adicionar produtos ao carrinho.
- [ ] Clientes conseguirem finalizar pedidos.
- [ ] Os pedidos forem persistidos corretamente.
- [ ] Clientes conseguirem consultar seus pedidos.
- [ ] Administradores conseguirem gerenciar produtos.
- [ ] Administradores conseguirem atualizar pedidos.
- [ ] O controle de permissões funcionar.
- [ ] Os testes automatizados forem executados.
- [ ] A aplicação funcionar em dispositivos móveis.
- [ ] A documentação estiver disponível no GitHub.

---

# 14. Fora do escopo inicial

Para manter o projeto viável dentro do prazo acadêmico, não serão desenvolvidos inicialmente:

- Aplicativo nativo Android ou iOS.
- Integração com ERP.
- Integração com transportadoras.
- Programa de fidelidade.
- Cupons avançados.
- Gestão de estoque por lote.
- Emissão de notas fiscais.
- Painéis avançados de BI.

O pagamento será demonstrado por meio de um fluxo controlado de teste, com possibilidade de integração futura com gateway real.

---

# 15. Estratégia de desenvolvimento

O desenvolvimento será organizado em cinco etapas.

**Sprint 1 — Fundação**
- Configuração do Next.js.
- Configuração do PostgreSQL.
- Docker Compose.
- Prisma.
- Modelagem e migrations.
- Estrutura arquitetural.

**Sprint 2 — Catálogo e autenticação**
- Cadastro e login.
- Controle de acesso.
- Catálogo.
- Categorias.
- Gerenciamento de produtos.

**Sprint 3 — Compras**
- Carrinho.
- Checkout.
- Pedidos.
- Itens de pedido.
- Pagamento demonstrativo.

**Sprint 4 — Administração e qualidade**
- Dashboard.
- Gerenciamento de pedidos.
- Testes unitários.
- Testes de integração.
- Testes E2E.

**Sprint 5 — Validação e entrega**
- Testes com cinco colegas.
- Coleta de feedback.
- Correções.
- Retestes.
- Documentação.
- Vídeos.
- Publicação no GitHub.

---

# 16. Definição de sucesso

A solução deverá demonstrar a aplicação prática dos conhecimentos de Engenharia de Software, especialmente levantamento de requisitos, arquitetura, modelagem de dados, desenvolvimento, versionamento e qualidade de software.

O principal resultado esperado é uma aplicação funcional, documentada e validada, que resolva o problema de digitalização das vendas da loja de cupcakes gourmet.