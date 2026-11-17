# Manual do Usuário — Cupcake Gourmet
**Projeto Integrador Transdisciplinar em Engenharia de Software II**
**Aluno:** Murilo Bandeira Gruppi — RGM 34169679

---

## Introdução

Bem-vindo ao **Cupcake Gourmet**, a plataforma online da nossa confeitaria artesanal.

Este manual descreve como utilizar o sistema para navegar pelo catálogo, realizar pedidos e acompanhar suas compras. Há também uma seção para administradores que gerenciam produtos e pedidos.

---

# PARTE 1 — GUIA DO CLIENTE

## 1. Acessando a plataforma

Abra um navegador (Chrome, Firefox, Safari ou Edge) e acesse:

```
http://localhost:3000
```

Você verá a **página inicial** com destaque para os produtos e um botão "Ver Cardápio".

---

## 2. Criando sua conta

1. Clique em **"Cadastrar"** no canto superior direito (ou no menu hambúrguer no celular).
2. Preencha:
   - **Nome completo** — como você quer ser chamado
   - **E-mail** — será usado para fazer login
   - **Senha** — mínimo 8 caracteres, com letra maiúscula, número e caractere especial
3. Clique em **"Criar conta"**.
4. Você será redirecionado automaticamente para a página inicial, já logado.

> 💡 Se já tiver uma conta, clique em **"Entrar"** e preencha e-mail e senha.

---

## 3. Navegando no catálogo

Clique em **"Cardápio"** no menu superior para ver todos os nossos cupcakes.

### 3.1 Busca por nome

Digite o nome de um cupcake no campo de busca (ícone de lupa). Os resultados aparecem automaticamente após uma breve pausa.

Para limpar a busca, clique no **X** dentro do campo.

### 3.2 Filtro por categoria

Clique em um dos botões de categoria (ex: **Clássicos**, **Especiais**, **Veganos**, **Sem Glúten**) para ver apenas os produtos daquela categoria.

Clique em **"Todos"** para remover o filtro.

### 3.3 Detalhes do produto

Clique em **"Ver"** em qualquer produto para ver a descrição completa, o preço e adicionar ao carrinho.

---

## 4. Adicionando produtos ao carrinho

Na página de detalhes do produto:

1. Use os botões **−** e **+** para escolher a quantidade desejada.
2. Clique em **"Adicionar ao Carrinho"**.
3. O botão mudará para **"Adicionado!"** confirmando o sucesso.

> ⚠️ Você precisa estar logado para adicionar ao carrinho. Se não estiver, será redirecionado para o login.

---

## 5. Visualizando e editando o carrinho

Clique no **ícone do carrinho** (🛒) no cabeçalho para ir à página do carrinho.

No carrinho você pode:
- Ver todos os produtos selecionados
- **Alterar a quantidade** usando os botões − e +
- **Remover um item** clicando no ícone de lixeira 🗑️
- Ver o **subtotal** e o **total** do pedido

Quando estiver satisfeito, clique em **"Finalizar Pedido"**.

---

## 6. Finalizando o pedido (Checkout)

### 6.1 Endereço de entrega

Preencha todos os campos obrigatórios (marcados com \*):

| Campo | Exemplo |
|-------|---------|
| Logradouro | Rua das Flores |
| Número | 42 |
| Complemento | Apto 301 (opcional) |
| Bairro | Jardim Primavera |
| CEP | 01310-100 |
| Cidade | São Paulo |
| Estado | SP |

> 💡 O CEP aceita o formato `00000-000`. O hífen é inserido automaticamente.

### 6.2 Forma de pagamento

Selecione uma das opções:
- 💳 **Cartão (simulado)**
- 🏦 **Pix (simulado)**
- 📄 **Boleto (simulado)**

> ⚠️ Este é um modo **demonstrativo** — nenhum valor real é cobrado.

### 6.3 Confirmando o pedido

Clique em **"Confirmar e Pagar"**. O sistema irá:
1. Validar seus dados
2. Verificar os preços atualizados no servidor
3. Registrar seu pedido
4. Processar o pagamento demonstrativo
5. Redirecionar você para a tela de confirmação

---

## 7. Acompanhando seus pedidos

Clique em **"Meus Pedidos"** no menu (ou no seu nome, no canto superior direito).

Você verá uma lista de todos os seus pedidos com:
- Número do pedido
- Data
- Valor total
- Status atual

### Status dos pedidos

| Status | Significado |
|--------|-------------|
| ⏳ Pendente | Pedido recebido, aguardando confirmação |
| ✅ Confirmado | Estabelecimento confirmou o pedido |
| 👨‍🍳 Em preparo | Seus cupcakes estão sendo feitos |
| 🚗 Saiu para entrega | A caminho da sua casa |
| 🎉 Entregue | Bom proveito! |
| ❌ Cancelado | Pedido foi cancelado |

Clique em qualquer pedido para ver os detalhes completos, incluindo os itens, endereço de entrega e linha do tempo de rastreamento.

---

## 8. Saindo da conta

Clique no **ícone de logout** (→↯) no canto superior direito para encerrar sua sessão.

No celular, o botão de logout está dentro do **menu hambúrguer** (☰).

---

# PARTE 2 — GUIA DO ADMINISTRADOR

> ⚠️ Esta seção é exclusiva para usuários com perfil **ADMIN**.

**Credenciais padrão do ambiente de desenvolvimento:**
- E-mail: `admin@cupcakegourmet.com`
- Senha: `Admin@123456`

---

## 9. Acessando o painel administrativo

Após fazer login com uma conta de administrador, clique em **"Admin"** no menu superior ou acesse diretamente `/admin`.

---

## 10. Dashboard

A página inicial do painel exibe:
- **Receita do Dia** — total faturado hoje
- **Receita do Mês** — total faturado no mês atual
- **Total de Pedidos** — quantidade total de pedidos
- **Produtos Cadastrados** — total de produtos no sistema
- **Pedidos por Status** — distribuição dos pedidos por status

---

## 11. Gerenciando produtos

Acesse **"Produtos"** na barra lateral esquerda.

### 11.1 Listagem

A tabela exibe todos os produtos com nome, categoria, preço e status (Ativo/Inativo).

### 11.2 Criar novo produto

1. Clique em **"Novo Produto"**
2. Preencha:
   - **Nome** (mínimo 2 caracteres)
   - **Descrição** (mínimo 10 caracteres)
   - **Preço** (valor em reais, ex: `12.90`)
   - **URL da imagem** (link externo, opcional)
   - **Categoria** (seleção obrigatória)
3. Clique em **"Criar produto"**

### 11.3 Editar produto

Clique no ícone de lápis ✏️ na linha do produto para editar suas informações.

### 11.4 Desativar produto

Clique no ícone de energia ⏻ na linha do produto.

Um diálogo de confirmação aparecerá com o nome do produto. Clique em **"Desativar produto"** para confirmar.

> ⚠️ Produtos desativados não aparecem no catálogo para clientes. O histórico de pedidos é preservado.

Para reativar, edite o produto e marque a opção "Produto ativo".

---

## 12. Gerenciando pedidos

Acesse **"Pedidos"** na barra lateral esquerda.

### 12.1 Filtrar pedidos

Use os botões de filtro no topo para visualizar pedidos por status:
- Todos
- Pendentes
- Confirmados
- Em Preparo
- Em Entrega
- Concluídos
- Cancelados

### 12.2 Atualizar status

1. Clique no **ícone de olho** 👁️ para ver os detalhes de um pedido.
2. Na página de detalhes, encontre o bloco **"Atualizar Status"**.
3. Selecione o novo status no seletor.
4. Clique em **"Atualizar"**.

---

## 13. Acesso em dispositivos móveis

A plataforma é totalmente responsiva. No celular:
- Use o menu **☰** no canto superior direito para acessar todas as opções
- O carrinho e as ações principais estão sempre visíveis no cabeçalho

---

## 14. Problemas comuns

| Problema | Solução |
|---------|---------|
| Não consigo fazer login | Verifique e-mail e senha. Use "Esqueci minha senha" se disponível |
| Carrinho está vazio após login | Adicione os itens novamente — carrinho anônimo não é migrado na versão atual |
| Pedido com status "Pendente" há muito tempo | Entre em contato com o estabelecimento |
| Imagem do produto não carrega | O produto pode ter uma URL de imagem inválida. O sistema exibe 🧁 como fallback |
