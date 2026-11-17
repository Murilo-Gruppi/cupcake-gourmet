# Registro de Melhorias Pós-Testes — Cupcake Gourmet
**Projeto Integrador Transdisciplinar em Engenharia de Software II**
**Aluno:** Murilo Bandeira Gruppi — RGM 34169679

---

## Resumo

Após a avaliação com 5 colegas (17/11/2026), foram identificados 11 pontos de melhoria, sendo 3 de impacto funcional/visual corrigidos imediatamente e 8 registrados como melhorias para versão futura.

---

## Melhorias Implementadas

### MH01 — Feedback visual para pedido cancelado na timeline

**Avaliador:** Cecilia Bandeira
**Problema:** Quando um pedido era cancelado, a tela de rastreamento exibia todos os passos do fluxo acinzentados, sem nenhuma mensagem explicando o estado cancelado. O usuário poderia interpretar como bug ou pedido ainda não processado.

**Solução implementada:**
- Adicionado bloco condicional `if (order.status === "CANCELED")` no componente de timeline
- Exibe banner vermelho explícito: "Pedido cancelado" com indicador visual (ponto vermelho + container com borda destrutiva)
- O fluxo normal de passos é preservado para todos os outros status

**Arquivo:** `src/app/(store)/orders/[id]/page.tsx`
**Commit:** `fix(ux): correções pós-avaliação de colegas`
**Data:** 17/11/2026

---

### MH02 — Paginação do catálogo com client-side routing

**Avaliador:** Felipe Leão
**Problema:** Os botões de paginação do catálogo de produtos usavam elementos `<a>` nativos do HTML, causando um recarregamento completo da página ao navegar entre páginas. Em uma aplicação Next.js, isso é desnecessário e resulta em flash de tela e pior experiência.

**Solução implementada:**
- Substituídos todos os elementos `<a>` por `<Link>` do Next.js na paginação
- Refatorada a construção da URL com `URLSearchParams` para código mais limpo
- Preservados os parâmetros de busca e categoria ao paginar

**Arquivo:** `src/app/(store)/products/page.tsx`
**Commit:** `fix(ux): correções pós-avaliação de colegas`
**Data:** 17/11/2026

---

### MH03 — Confirmação de desativação com Dialog acessível

**Avaliador:** Felipe Leão
**Problema:** O botão de desativar produto no painel administrativo usava `window.confirm()` e `window.alert()` nativos do navegador. Esses elementos têm visual inconsistente com o design system, não são acessíveis e bloqueiam a thread do navegador.

**Solução implementada:**
- Criado componente `Dialog` baseado em Radix UI (`@radix-ui/react-dialog`) com animações, overlay e botão de fechar acessível
- `DeactivateProductButton` refatorado para usar o Dialog com:
  - Título descritivo
  - Descrição com nome do produto e aviso sobre preservação de histórico
  - Botão "Cancelar" e "Desativar produto" (destructive)
  - Feedback de erro inline em caso de falha na API
- Prop `productName` adicionada para contextualizar a confirmação

**Arquivos:** `src/components/ui/dialog.tsx` (novo), `src/app/admin/products/DeactivateProductButton.tsx`, `src/app/admin/products/page.tsx`
**Commit:** `fix(ux): correções pós-avaliação de colegas`
**Data:** 17/11/2026

---

## Melhorias Registradas para Versão Futura

### MF01 — Integração com ViaCEP para auto-preenchimento de CEP
**Avaliador:** Pedro Abib
**Descrição:** Ao digitar o CEP no checkout, preencher automaticamente os campos de logradouro, bairro, cidade e estado via API pública ViaCEP (`https://viacep.com.br/ws/{cep}/json/`).
**Impacto:** Reduz erros de digitação e melhora significativamente a experiência no mobile.
**Prioridade:** Média

---

### MF02 — Merge de carrinho anônimo ao fazer login
**Avaliador:** Pedro Abib
**Descrição:** Implementar lógica para migrar itens do carrinho localStorage (Zustand) para o carrinho autenticado no banco de dados durante o processo de login via callback `signIn` do next-auth.
**Impacto:** Usuários não perdem itens ao fazer login após navegar sem autenticação.
**Prioridade:** Média

---

### MF03 — Rate limiting nas rotas de autenticação
**Avaliador:** Rafael Souza
**Descrição:** Implementar limite de tentativas de login (ex: 5 tentativas por minuto por IP) para prevenir ataques de força bruta. Pode ser implementado com `@vercel/kv` + middleware ou biblioteca `express-rate-limit`.
**Impacto:** Segurança — previne comprometimento de contas por brute force.
**Prioridade:** Alta (produção)

---

### MF04 — Otimização de imagens externas com Next.js Image
**Avaliador:** Cecilia Bandeira
**Descrição:** Remover `unoptimized` do componente `Image` e configurar domínios externos em `next.config.js` para aproveitar a otimização automática de imagens do Next.js (redimensionamento, WebP, lazy loading).
**Impacto:** Performance e qualidade visual das imagens dos produtos.
**Prioridade:** Baixa

---

### MF05 — Formulário de checkout responsivo no mobile
**Avaliador:** Kaye Castelli
**Descrição:** Substituir `grid-cols-3` fixo pelo grid responsivo `grid-cols-1 sm:grid-cols-3` nos campos de logradouro/número e cidade/estado, para que fiquem empilhados em telas pequenas.
**Impacto:** Usabilidade do formulário de checkout em smartphones.
**Prioridade:** Média

---

### MF06 — Contador de itens no carrinho no cabeçalho
**Avaliador:** Pedro Abib
**Descrição:** Exibir badge com número de itens no ícone do carrinho no header, similar ao padrão de e-commerces.
**Impacto:** UX — feedback imediato da quantidade de itens selecionados.
**Prioridade:** Baixa

---

### MF07 — Haptic feedback ao adicionar ao carrinho no mobile
**Avaliador:** Kaye Castelli
**Descrição:** Adicionar `navigator.vibrate(50)` no `AddToCartButton` ao confirmar adição, para feedback tátil em dispositivos que suportam a API Vibration.
**Impacto:** UX mobile — confirmação sensorial da ação.
**Prioridade:** Baixa

---

### MF08 — Exibir duração da sessão ao usuário
**Avaliador:** Rafael Souza
**Descrição:** Exibir informação de quando a sessão irá expirar ou oferecer opção de "manter conectado".
**Impacto:** Transparência e confiança do usuário.
**Prioridade:** Baixa

---

## Tabela de rastreabilidade

| ID | Descrição | Avaliador | Tipo | Status | Commit |
|----|-----------|-----------|------|--------|--------|
| MH01 | Timeline de pedido cancelado | Cecilia | Visual | ✅ Implementado | df6ce27 |
| MH02 | Paginação com Link (sem reload) | Felipe | Performance | ✅ Implementado | df6ce27 |
| MH03 | Dialog de confirmação acessível | Felipe | UX/A11y | ✅ Implementado | df6ce27 |
| MF01 | Auto-preenchimento CEP (ViaCEP) | Pedro | UX | 📋 Backlog | — |
| MF02 | Merge carrinho anônimo | Pedro | Funcional | 📋 Backlog | — |
| MF03 | Rate limiting autenticação | Rafael | Segurança | 📋 Backlog | — |
| MF04 | Otimização de imagens | Cecilia | Performance | 📋 Backlog | — |
| MF05 | Checkout mobile responsivo | Kaye | UX mobile | 📋 Backlog | — |
| MF06 | Badge contador carrinho | Pedro | UX | 📋 Backlog | — |
| MF07 | Haptic feedback mobile | Kaye | UX mobile | 📋 Backlog | — |
| MF08 | Exibir expiração de sessão | Rafael | UX | 📋 Backlog | — |
