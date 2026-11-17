# Roteiro dos Vídeos — Cupcake Gourmet
**Projeto Integrador Transdisciplinar em Engenharia de Software II**
**Aluno:** Murilo Bandeira Gruppi — RGM 34169679

---

# VÍDEO 1 — Apresentação do Projeto
**Requisito do PRD:** Item 19 — Vídeo narrado de pelo menos 5 minutos
**Duração estimada:** 7–9 minutos

---

## Roteiro detalhado

### ABERTURA (0:00 – 0:30)

**[Tela: câmera no rosto ou slide com título do projeto]**

> "Olá, meu nome é Murilo Bandeira Gruppi, RGM 34169679. Este é o meu projeto integrador da disciplina de Engenharia de Software II: o Cupcake Gourmet, uma plataforma de vendas online e gerenciamento de pedidos para uma confeitaria artesanal.
>
> Vou apresentar a aplicação completa, mostrando o sistema funcionando, as decisões técnicas que tomei e como cada requisito do PRD foi atendido."

---

### PARTE 1 — CONTEXTO E OBJETIVO (0:30 – 1:30)

**[Tela: abrir o PRD.md no editor ou mostrar slide de requisitos]**

> "O projeto nasceu de um problema real: uma loja de cupcakes gourmet precisava expandir para o digital, mas uma tentativa anterior falhou por problemas no levantamento de requisitos.
>
> O desafio era criar uma aplicação web responsiva com:
> — Catálogo de produtos com busca e filtros
> — Carrinho de compras e fluxo de checkout
> — Painel administrativo para gerenciar produtos e pedidos
> — Autenticação com controle de perfis CUSTOMER e ADMIN
>
> Tecnicamente, optei por Next.js 14 com App Router e TypeScript, PostgreSQL com Prisma 7, next-auth v5 para autenticação e Zod para validação. Testes com Vitest e Playwright."

---

### PARTE 2 — ARQUITETURA (1:30 – 2:30)

**[Tela: mostrar estrutura de pastas no VS Code]**

> "A arquitetura segue um modelo modular inspirado em MVC. Vou mostrar rapidamente a estrutura.
>
> [Abrir src/modules/]
>
> Cada domínio tem seu próprio Service, Repository e Validations isolados. Por exemplo, aqui em 'orders': o OrderService contém as regras de negócio — como a criação de pedidos em transação e o cálculo de preços no servidor. O OrderRepository faz as consultas ao banco via Prisma.
>
> [Abrir src/app/api/]
>
> Os Route Handlers são os controladores. Eles recebem a requisição, verificam a sessão e delegam para o Service.
>
> Uma decisão importante: o middleware de proteção de rotas usa um arquivo separado — auth.config.ts — sem importar o Prisma. Isso é necessário porque o middleware roda no Edge Runtime do Next.js, que não suporta módulos Node.js como o driver de PostgreSQL."

---

### PARTE 3 — DEMONSTRAÇÃO: FLUXO DO CLIENTE (2:30 – 5:30)

**[Tela: navegador com a aplicação rodando em localhost:3000]**

> "Vamos ver o sistema funcionando. Estou acessando a página inicial."

**[Mostrar página inicial]**
> "A identidade visual usa tons de rosa e creme, remetendo a uma confeitaria gourmet."

**[Navegar para /products]**
> "No catálogo temos 10 produtos do seed inicial. Posso filtrar por categoria — aqui, 'Veganos' — e a URL é atualizada usando client-side routing do Next.js, sem recarregar a página."

**[Usar busca]**
> "A busca tem um debounce de 400 milissegundos para não disparar requisições a cada tecla."

**[Clicar em um produto]**
> "Na página de detalhe, posso ajustar a quantidade e adicionar ao carrinho. Como não estou logado, vou ser redirecionado para o login."

**[Fazer login com cliente@exemplo.com / Cliente@123456]**
> "Usando as credenciais do seed. O login usa JWT via next-auth v5, sem session store no banco."

**[Adicionar produto ao carrinho]**
> "Adicionado com sucesso. O botão confirma visualmente."

**[Ir para /cart]**
> "No carrinho posso ajustar quantidades ou remover itens. O subtotal é atualizado pelo servidor após cada operação."

**[Ir para /checkout]**
> "No checkout preencho o endereço de entrega e escolho a forma de pagamento. Este é o modo demonstrativo — nenhum valor real é cobrado.
>
> [Preencher formulário]
>
> Ao confirmar, o servidor consulta os preços no banco de dados — nunca confia nos valores enviados pelo cliente. O total é calculado server-side. Tudo ocorre em uma transação de banco de dados."

**[Concluir pedido]**
> "Pedido confirmado! Vejo a tela de sucesso com os itens, endereço e a linha do tempo de rastreamento."

---

### PARTE 4 — DEMONSTRAÇÃO: PAINEL ADMINISTRATIVO (5:30 – 7:00)

**[Logout e login com admin@cupcakegourmet.com / Admin@123456]**

> "Agora vou mostrar o painel administrativo. Clico em 'Admin' no cabeçalho."

**[Mostrar dashboard]**
> "O dashboard exibe os KPIs: receita do dia, do mês, total de pedidos e produtos cadastrados."

**[Ir para admin/products]**
> "Na gestão de produtos, posso criar, editar e desativar produtos. Ao desativar, aparece um diálogo de confirmação — desenvolvido com Radix UI, consistente com o design system."

**[Criar novo produto]**
> "Preencho os campos e crio um produto. Ele aparece imediatamente na tabela."

**[Ir para admin/orders]**
> "Na gestão de pedidos, tenho filtros por status. Posso ver o pedido que acabei de criar e atualizar o status — de Pendente para Confirmado, por exemplo."

---

### ENCERRAMENTO (7:00 – 7:30)

> "Para encerrar: o projeto atende todos os 18 requisitos funcionais do PRD, implementa as 12 regras de negócio no servidor, possui 104 testes automatizados — 66 unitários, 11 de integração e 27 E2E — e recebeu nota média 4,4 de 5 na avaliação com 5 colegas.
>
> Toda a documentação técnica está na pasta /docs do repositório. Obrigado."

---

---

# VÍDEO 2 — Demonstração das Melhorias Pós-Testes
**Requisito do PRD:** Item 20 — Vídeo demonstrando as modificações após os testes com usuários
**Duração estimada:** 3–5 minutos

---

## Roteiro detalhado

### ABERTURA (0:00 – 0:20)

**[Tela: câmera ou slide]**

> "Olá, sou Murilo Bandeira Gruppi. Neste vídeo vou mostrar as três melhorias implementadas após a avaliação do sistema com cinco colegas."

---

### MELHORIA 1 — Feedback de pedido cancelado (0:20 – 1:30)

**[Tela: abrir o arquivo orders/[id]/page.tsx no editor]**

> "O primeiro problema foi reportado pela Cecilia Bandeira. Quando um pedido estava com status CANCELADO, a tela de rastreamento mostrava todos os passos acinzentados sem nenhuma explicação — parecia um bug."

**[Mostrar o código antigo / novo lado a lado se possível, ou apenas o trecho novo]**

> "A correção foi adicionar um bloco condicional: se o status for CANCELED, em vez da timeline normal, exibimos um banner vermelho com a mensagem 'Pedido cancelado'."

**[Abrir navegador e mostrar uma ordem cancelada]**

> "Aqui está o resultado. O usuário agora vê claramente que o pedido foi cancelado, com indicador visual vermelho e texto explicativo."

---

### MELHORIA 2 — Paginação sem recarregamento de página (1:30 – 2:30)

**[Tela: abrir o catálogo de produtos]**

> "O Felipe Leão identificou que ao clicar nos botões de paginação do catálogo, a página inteira recarregava. Isso causava um flash de tela desnecessário."

**[Mostrar o código: linha do <Link> no products/page.tsx]**

> "O problema era o uso de tags `<a>` nativas em vez do componente `Link` do Next.js. Substituindo por `Link`, a navegação passa a ser client-side — sem recarregamento completo."

**[Demonstrar no browser: navegar entre páginas do catálogo]**

> "Agora a transição entre páginas é suave, sem o flash branco. A URL é atualizada e os filtros de categoria e busca são preservados."

---

### MELHORIA 3 — Dialog de confirmação acessível (2:30 – 4:00)

**[Tela: ir para admin/products]**

> "O Felipe também apontou que a confirmação de desativação de produto usava o `confirm()` nativo do browser — com visual completamente diferente do resto da interface."

**[Mostrar o botão de desativar e o diálogo antigo vs. novo]**

> "Criei um componente Dialog baseado em Radix UI. Ele inclui overlay animado, título descritivo, o nome do produto para confirmação visual, botão de cancelar e botão de desativação destrutivo.
>
> Se a API retornar um erro, o feedback aparece inline no próprio diálogo, sem alert nativo."

**[Demonstrar no browser: clicar em desativar, ver o dialog, confirmar]**

> "Muito mais consistente com o design system da aplicação e acessível por teclado e leitores de tela."

---

### ENCERRAMENTO (4:00 – 4:30)

> "No total foram 3 melhorias implementadas diretamente e 8 registradas como débito técnico para versão futura — incluindo integração com ViaCEP, merge de carrinho anônimo e rate limiting.
>
> Todo o registro está disponível em docs/melhorias-pos-testes.md no repositório. Obrigado."

---

## Dicas de gravação

### Para ambos os vídeos:
- Use **OBS Studio** ou **Loom** para gravação de tela com narração
- Grave em resolução mínima **1280×720** (preferível 1920×1080)
- Certifique-se de que o microfone está funcionando antes de começar
- Faça um teste de 30 segundos para verificar áudio e vídeo
- Fale pausadamente e claramente — não precisa ser rápido

### Preparação antes de gravar:
1. Iniciar banco: `npm run db:up`
2. Reconfigurar seed: `npm run db:seed`
3. Iniciar servidor: `npm run dev`
4. Fazer logout de qualquer sessão ativa
5. Preparar uma aba com a aplicação e outra com o código (VS Code)
6. Fechar notificações do sistema operacional

### Ordem recomendada de gravação:
1. Grave o Vídeo 2 (melhorias) primeiro — é menor e serve de aquecimento
2. Grave o Vídeo 1 (apresentação completa) em seguida
