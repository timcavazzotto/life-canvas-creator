

## Plano: Ajustes no Admin (Afiliados + Pedidos)

### Resumo

Três mudanças:
1. **Campo de desconto por afiliado** — cada afiliado pode ter um percentual de desconto no produto (ex: 10% OFF para quem usar o código)
2. **Código 100% OFF** — permitir desconto de 100%, zerando o valor (para testes/presentes)
3. **Tabela de pedidos** — remover coluna "Impressão", renomear/remover "Rastreio", adicionar coluna "Afiliado"

---

### Detalhes Técnicos

#### 1. Nova coluna `discount_pct` na tabela `affiliates`

- Migration: `ALTER TABLE affiliates ADD COLUMN discount_pct numeric NOT NULL DEFAULT 0;`
- Valor de 0 a 100. Um afiliado com `discount_pct = 100` funciona como código 100% OFF.

#### 2. Admin — Tela de Afiliados (`AffiliateManager.tsx`)

- Adicionar campo editável "Desconto %" na tabela e no formulário de criação, similar ao campo de comissão já existente.
- O admin poderá definir qualquer valor de 0 a 100.

#### 3. Aplicar desconto no checkout

- **`OrderModal.tsx`**: Ao validar o cupom, buscar também `discount_pct` do afiliado. Calcular o `amount_cents` final: `2900 * (1 - discount_pct/100)`. Mostrar o valor com desconto ao usuário.
- **`create-checkout/index.ts`**: Ao encontrar o afiliado, buscar `discount_pct` e recalcular `amount_cents` no servidor (fonte de verdade). Se `amount_cents` resultar em 0, pular a criação do link de pagamento e marcar o pedido como `paid` diretamente.

#### 4. Tabela de Pedidos (`OrderManager.tsx`)

- Remover coluna "Impressão" (`print_status`)
- Remover coluna "Rastreio" (`tracking_code`)
- Adicionar coluna "Afiliado" mostrando `affiliate_code` (ou "—" se vazio)

---

### Arquivos modificados

| Arquivo | Mudança |
|---|---|
| Migration SQL | Adicionar `discount_pct` na tabela `affiliates` |
| `src/pages/admin/AffiliateManager.tsx` | Campo de desconto no form e na tabela |
| `src/components/OrderModal.tsx` | Buscar `discount_pct`, calcular preço com desconto, exibir |
| `supabase/functions/create-checkout/index.ts` | Validar desconto server-side, tratar pedido grátis |
| `src/pages/admin/OrderManager.tsx` | Remover colunas Impressão/Rastreio, adicionar Afiliado |

