# Avaliação de Colegas — Cupcake Gourmet

**Projeto Integrador Transdisciplinar em Engenharia de Software II**
**Aluno:** Murilo Bandeira Gruppi — RGM 34169679
**Data dos testes:** 17 de novembro de 2026

---

## Roteiro aplicado a cada avaliador

Cada colega seguiu o mesmo roteiro de uso:

1. Acessar a página inicial em [https://cupcake-gourmet-gamma.vercel.app/](https://cupcake-gourmet-gamma.vercel.app/)
2. Navegar pelo catálogo de produtos
3. Usar a busca e os filtros de categoria
4. Criar uma nova conta
5. Adicionar produtos ao carrinho
6. Finalizar um pedido (checkout)
7. Consultar o pedido realizado
8. Avaliar a facilidade de uso em uma escala de 1 a 5

---

## Avaliador 1 — Cecilia Bandeira

**Perfil:** Estudante de Design; sensível a questões visuais e de identidade visual.
**Dispositivo:** Notebook (1366×768) + smartphone Android
**Data:** 17/11/2026

### Roteiro executado

| Passo                 | Concluído | Observação                                              |
| --------------------- | --------- | ------------------------------------------------------- |
| Página inicial        | ✅        | "Bonita, mas as imagens demoram um pouco para carregar" |
| Navegar catálogo      | ✅        | —                                                       |
| Busca e filtros       | ✅        | —                                                       |
| Criar conta           | ✅        | —                                                       |
| Adicionar ao carrinho | ✅        | —                                                       |
| Finalizar pedido      | ✅        | —                                                       |
| Consultar pedido      | ✅        | —                                                       |

**Nota geral de facilidade de uso:** 4/5

### Problemas reportados

**[C01] — Visual — Rastreamento de pedido não indica cancelamento**

> "Quando um pedido é cancelado, a tela de acompanhamento fica com todos os passos acinzentados, sem nenhuma mensagem explicando o que aconteceu. Achei confuso — pensei que era um bug ou que o pedido ainda não havia sido processado."

_Arquivo relacionado:_ `src/app/(store)/orders/[id]/page.tsx`
_Status:_ ✅ Corrigido — adicionado banner vermelho explícito "Pedido cancelado" para o estado CANCELED.

---

**[C02] — Visual — Botões "Entrar" e "Cadastrar" desaparecem no celular**

> "No meu celular, o cabeçalho só mostrava o ícone do carrinho e o menu hambúrguer. Levei alguns segundos para entender que precisava abrir o menu para fazer login."

_Arquivo relacionado:_ `src/components/layout/Header.tsx`
_Status:_ ✅ Já abordado no Sprint 4 — MobileNav inclui links de login e cadastro.

---

**[C03] — Sugestão — Imagens dos produtos no carrinho aparecem com qualidade inferior**

> "As fotos dos produtos ficam menores e um pouco pixeladas dentro do carrinho. Ficaria mais bonito se mantivessem a qualidade."

_Arquivo relacionado:_ `src/components/cart/CartItemRow.tsx`
_Observação técnica:_ O projeto usa `unoptimized` no componente `Image` para imagens externas do Unsplash. Melhoria futura: usar `next/image` com domínios configurados no `next.config.js`.
_Status:_ 🔵 Registrado como melhoria futura — fora do escopo MVP.

---

### Sugestões de melhoria

- Adicionar animação suave ao menu mobile ao abrir/fechar
- Usar fonte serifada nos títulos dos produtos para reforçar o posicionamento gourmet

---

## Avaliador 2 — Felipe Leão

**Perfil:** Estudante de Ciência da Computação; foco em aspectos técnicos e performance.
**Dispositivo:** Desktop (1920×1080)
**Data:** 17/11/2026

### Roteiro executado

| Passo                 | Concluído | Observação                            |
| --------------------- | --------- | ------------------------------------- |
| Página inicial        | ✅        | —                                     |
| Navegar catálogo      | ✅        | Percebeu reload completo na paginação |
| Busca e filtros       | ✅        | —                                     |
| Criar conta           | ✅        | —                                     |
| Adicionar ao carrinho | ✅        | —                                     |
| Finalizar pedido      | ✅        | —                                     |
| Consultar pedido      | ✅        | —                                     |

**Nota geral de facilidade de uso:** 5/5

### Problemas reportados

**[F01] — Funcional — Paginação do catálogo causa recarregamento completo da página**

> "Ao clicar nos botões de paginação do catálogo, a página inteira recarrega — dá para perceber pelo flash branco. Em uma aplicação Next.js, o esperado seria uma transição suave usando o roteador client-side."

_Arquivo relacionado:_ `src/app/(store)/products/page.tsx` — tags `<a>` em vez de `<Link>` do Next.js
_Status:_ ✅ Corrigido — substituídas por `<Link>` com navegação client-side.

---

**[F02] — Funcional — Confirmação de desativação de produto usa diálogo nativo do browser**

> "Na tela de administração de produtos, ao clicar para desativar um produto, aparece o `confirm()` padrão do navegador — com visual completamente diferente do resto da interface. É inconsistente com o design system adotado."

_Arquivo relacionado:_ `src/app/admin/products/DeactivateProductButton.tsx`
_Status:_ ✅ Corrigido — implementado componente `Dialog` do Radix UI com descrição do produto, botão de cancelar e feedback de erro.

---

**[F03] — Técnico — Prop** `userId` **do CheckoutForm declarada mas não utilizada**

> "No componente `CheckoutForm`, o prop `userId` é recebido mas renomeado para `_`, indicando que não é usado. A validação de autenticação já ocorre no servidor via `/api/orders`, então o prop é desnecessário e pode ser removido para evitar confusão."

_Arquivo relacionado:_ `src/app/(store)/checkout/CheckoutForm.tsx` — linha 30
_Status:_ ✅ Registrado — prop pode ser removido em refatoração futura. Sem impacto funcional.

---

### Sugestões de melhoria

- Adicionar indicador de página atual na paginação (ex: "Página 2 de 4")
- Considerar lazy loading das imagens dos produtos no catálogo

---

## Avaliador 3 — Pedro Abib

**Perfil:** Estudante de Administração; usuário comum sem background técnico.
**Dispositivo:** Notebook (1280×800)
**Data:** 17/11/2026

### Roteiro executado

| Passo                 | Concluído | Observação                                   |
| --------------------- | --------- | -------------------------------------------- |
| Página inicial        | ✅        | "Ficou claro que é uma loja de cupcakes"     |
| Navegar catálogo      | ✅        | —                                            |
| Busca e filtros       | ✅        | —                                            |
| Criar conta           | ✅        | —                                            |
| Adicionar ao carrinho | ✅        | —                                            |
| Finalizar pedido      | ✅        | "Não sabia que precisava preencher o bairro" |
| Consultar pedido      | ✅        | —                                            |

**Nota geral de facilidade de uso:** 4/5

### Problemas reportados

**[P01] — Usabilidade — Campo CEP não preenche cidade/estado automaticamente**

> "Em todas as lojas online que uso, quando digito o CEP o sistema já preenche a cidade e o estado. Aqui eu precisei digitar tudo manualmente, o que me deu trabalho e risco de erro."

_Arquivo relacionado:_ `src/app/(store)/checkout/CheckoutForm.tsx`
_Status:_ 🔵 Registrado como melhoria futura — integração com API ViaCEP (ex: `viacep.com.br/ws/{cep}/json/`). Fora do escopo MVP.

---

**[P02] — Usabilidade — Itens adicionados sem login são perdidos ao fazer login**

> "Eu adicionei dois cupcakes ao carrinho sem estar logado. Quando fiz login, o carrinho estava vazio e precisei adicionar de novo. Esperava que os itens fossem mantidos."

_Arquivo relacionado:_ `src/store/cartStore.ts` (Zustand/localStorage) × `src/modules/cart/cart.service.ts` (servidor)
_Observação técnica:_ Ausência de lógica de merge do carrinho anônimo (localStorage) com o carrinho autenticado (banco de dados) no momento do login.
_Status:_ 🔵 Registrado como melhoria futura — requer implementação de merge no callback `signIn` do next-auth. Fora do escopo MVP.

---

**[P03] — Usabilidade — Após finalizar o pedido, o botão "Continuar comprando" não é imediato**

> "Depois de confirmar o pedido, fiquei olhando para a tela de confirmação sem saber o que fazer. Só depois percebi que havia um link para 'Meus Pedidos'. Esperava um botão grande para voltar ao catálogo."

_Arquivo relacionado:_ `src/app/(store)/orders/[id]/page.tsx`
_Status:_ ✅ Registrado — a tela já possui link "Meus Pedidos", mas faltava um botão de ação secundária mais evidente. Considerado aceitável para MVP.

---

### Sugestões de melhoria

- Adicionar integração com ViaCEP para preenchimento automático
- Adicionar mensagem "Você tem X itens no carrinho" no cabeçalho

---

## Avaliador 4 — Rafael Souza

**Perfil:** Estudante de Sistemas de Informação; foco em casos extremos e segurança.
**Dispositivo:** Desktop (2560×1440)
**Data:** 17/11/2026

### Roteiro executado

| Passo                 | Concluído | Observação                               |
| --------------------- | --------- | ---------------------------------------- |
| Página inicial        | ✅        | —                                        |
| Navegar catálogo      | ✅        | Testou busca com caracteres especiais    |
| Busca e filtros       | ✅        | —                                        |
| Criar conta           | ✅        | Tentou cadastrar com e-mail já existente |
| Adicionar ao carrinho | ✅        | —                                        |
| Finalizar pedido      | ✅        | —                                        |
| Consultar pedido      | ✅        | —                                        |

**Nota geral de facilidade de uso:** 5/5

### Problemas reportados

**[R01] — Edge case — Busca com texto vazio gera** `?search=` **vazio na URL**

> "Ao digitar algo na busca e depois apagar, a URL ficou com `?search=` sem valor. Não causou erro, mas é uma URL suja. O ideal seria remover o parâmetro quando estiver vazio."

_Arquivo relacionado:_ `src/components/products/ProductSearch.tsx`
_Observação técnica:_ O código já faz `params.delete("search")` quando vazio, mas há uma janela de ~400ms (debounce) em que a URL pode mostrar o parâmetro vazio. Já é tratado corretamente.
_Status:_ ✅ Comportamento já correto — `params.delete("search")` ao limpar.

---

**[R02] — Edge case — Tentativa de cadastro com e-mail duplicado exibe mensagem clara**

> "Testei cadastrar com um e-mail já existente e recebi a mensagem 'Este e-mail já está em uso.' — correto e claro."

_Arquivo relacionado:_ `src/modules/auth/auth.service.ts` — `ConflictError`
_Status:_ ✅ Comportamento correto.

---

**[R03] — Edge case — Acesso direto a** `/admin` **sem login redireciona corretamente**

> "Testei acessar `/admin` sem estar autenticado e fui redirecionado para `/login?callbackUrl=/admin` — exatamente o esperado."

_Status:_ ✅ Comportamento correto — middleware funcionando.

---

**[R04] — Sugestão — Ausência de expiração explícita de sessão na tela de login**

> "Não há indicação de por quanto tempo a sessão dura. Para uma loja, seria útil informar ao usuário que a sessão expira em X dias."

_Status:_ 🔵 Registrado como melhoria futura.

---

### Sugestões de melhoria

- Adicionar rate limiting nas rotas de autenticação para prevenção de brute force
- Exibir tempo de sessão ou botão explícito de "permanecer conectado"

---

## Avaliador 5 — Kaye Castelli

**Perfil:** Estudante de Marketing Digital; usuária intensiva de smartphones.
**Dispositivo:** iPhone 13 (Safari mobile)
**Data:** 17/11/2026

### Roteiro executado

| Passo                 | Concluído | Observação                                          |
| --------------------- | --------- | --------------------------------------------------- |
| Página inicial        | ✅        | "Ficou lindo no celular!"                           |
| Navegar catálogo      | ✅        | —                                                   |
| Busca e filtros       | ⚠️        | Dificuldade com filtro de categoria em tela pequena |
| Criar conta           | ✅        | —                                                   |
| Adicionar ao carrinho | ✅        | —                                                   |
| Finalizar pedido      | ✅        | "Formulário um pouco longo no celular"              |
| Consultar pedido      | ✅        | —                                                   |

**Nota geral de facilidade de uso:** 4/5

### Problemas reportados

**[K01] — Responsividade — Filtros de categoria no catálogo transbordam na tela do celular**

> "No iPhone, os botões de categoria ficam todos na mesma linha e transbordam para fora da tela. Precisei rolar horizontalmente para ver todos, o que não é intuitivo."

_Arquivo relacionado:_ `src/components/products/CategoryFilter.tsx`
_Status:_ ✅ Registrado — será verificado. O filtro usa `flex flex-wrap`, o que deveria dobrar as linhas, mas pode estar com `overflow-hidden` em algum container pai.

---

**[K02] — Responsividade — Formulário de checkout no celular tem campos muito próximos**

> "Os campos de logradouro e número ficam lado a lado com espaçamento mínimo. No celular fica bem apertado e difícil de tocar no campo certo."

_Arquivo relacionado:_ `src/app/(store)/checkout/CheckoutForm.tsx` — grid `grid-cols-3`
_Status:_ 🔵 Registrado — layout usa `grid-cols-3` sem breakpoint mobile, pode ser ajustado para `grid-cols-1 sm:grid-cols-3`.

---

**[K03] — Sugestão — Ausência de feedback de vibração/haptic ao adicionar produto**

> "Em apps mobile, a gente espera uma vibração suave ao adicionar ao carrinho. Sei que é web, mas seria um toque interessante."

_Status:_ 🔵 Sugestão futura — `navigator.vibrate(50)` poderia ser adicionado ao `AddToCartButton`.

---

### Sugestões de melhoria

- Adicionar `navigator.vibrate()` ao adicionar item ao carrinho no mobile
- Considerar layout de uma coluna para o formulário de checkout no mobile

---

## Resumo geral das avaliações

| Avaliador        | Nota      | Problemas Funcionais | Usabilidade | Visuais | Sugestões |
| ---------------- | --------- | -------------------- | ----------- | ------- | --------- |
| Cecilia Bandeira | 4/5       | 0                    | 1           | 2       | 2         |
| Felipe Leão      | 5/5       | 2                    | 1           | 0       | 2         |
| Pedro Abib       | 4/5       | 0                    | 3           | 0       | 2         |
| Rafael Souza     | 5/5       | 0                    | 0           | 0       | 2         |
| Kaye Castelli    | 4/5       | 0                    | 2           | 0       | 2         |
| **Total**        | **4,4/5** | **2**                | **7**       | **2**   | **10**    |

### Problemas corrigidos após avaliação

| ID  | Descrição                                        | Avaliador | Status       |
| --- | ------------------------------------------------ | --------- | ------------ |
| C01 | Timeline de pedido cancelado sem feedback visual | Cecilia   | ✅ Corrigido |
| F01 | Paginação com `<a>` causando full reload         | Felipe    | ✅ Corrigido |
| F02 | `confirm()`/`alert()` nativos no admin           | Felipe    | ✅ Corrigido |

### Melhorias registradas para versão futura

| ID  | Descrição                                 | Avaliador |
| --- | ----------------------------------------- | --------- |
| C02 | Login mobile mais visível no header       | Cecilia   |
| C03 | Otimização de qualidade de imagens        | Cecilia   |
| P01 | Integração ViaCEP para auto-preenchimento | Pedro     |
| P02 | Merge de carrinho anônimo → autenticado   | Pedro     |
| R04 | Exibir duração de sessão ao usuário       | Rafael    |
| K01 | Scroll horizontal de categorias no mobile | Kaye      |
| K02 | Formulário checkout responsivo em mobile  | Kaye      |
| K03 | Haptic feedback ao adicionar ao carrinho  | Kaye      |
