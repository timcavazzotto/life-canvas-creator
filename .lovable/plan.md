

## Plano: Portal do Afiliado com Login e Controle de Pagamentos

### Resumo
Criar um portal onde cada afiliada faz login com email/senha e visualiza suas vendas, comissões e saldo pendente. O admin marca comissões como pagas no painel, atualizando o saldo.

### Alterações no banco de dados

1. **Tabela `commission_payments`** — registra cada pagamento feito pelo admin
   - `id`, `affiliate_id` (FK → affiliates), `amount_cents`, `paid_at`, `notes`, `created_by` (user_id do admin)
   - RLS: admin pode INSERT/SELECT; afiliada pode SELECT apenas os seus

2. **Coluna `user_id` na tabela `affiliates`** — vincula a afiliada a uma conta de usuário
   - `user_id uuid REFERENCES auth.users(id)` (nullable inicialmente, preenchido quando a afiliada se cadastra)
   - RLS nova: afiliada pode SELECT o próprio registro (`user_id = auth.uid()`)

3. **Campo `commission_paid` na tabela `orders`** — boolean, default false
   - Admin marca quando a comissão daquele pedido já foi paga
   - RLS: já coberta pelas policies existentes de UPDATE para admin

### Novas páginas e rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/afiliado/login` | `AffiliateLogin.tsx` | Login com email/senha |
| `/afiliado` | `AffiliateDashboard.tsx` | Dashboard da afiliada |

### Dashboard da Afiliada (`/afiliado`)
- **Cards resumo**: Total de vendas, comissão total, comissão paga, saldo pendente
- **Tabela de vendas**: Pedidos com seu código, data, valor, comissão, status (pago/pendente)
- **Histórico de pagamentos**: Lista de pagamentos recebidos do admin
- Protegido por auth — redireciona para `/afiliado/login` se não logada

### Fluxo do Admin
- Na página de Afiliados, adicionar botão "Registrar Pagamento" por afiliada
- Modal simples: valor, data, observação
- Insere em `commission_payments` e opcionalmente marca `commission_paid = true` nos pedidos cobertos
- Visualização do saldo de cada afiliada na tabela existente

### Autenticação da Afiliada
- Usa o mesmo sistema de auth (email/senha), sem role especial
- A identificação é feita pelo `affiliates.user_id = auth.uid()`
- O admin cadastra a afiliada e ela se registra com o mesmo email — o sistema vincula automaticamente

### Arquivos a criar/alterar

| Arquivo | Ação |
|---------|------|
| Migration SQL | Criar `commission_payments`, adicionar `user_id` em affiliates, adicionar `commission_paid` em orders |
| `src/pages/AffiliateLogin.tsx` | Criar — login da afiliada |
| `src/pages/AffiliateDashboard.tsx` | Criar — dashboard com vendas e saldo |
| `src/hooks/useAffiliateAuth.ts` | Criar — hook de auth para afiliada |
| `src/pages/admin/AffiliateManager.tsx` | Alterar — adicionar botão de registrar pagamento e mostrar saldo |
| `src/App.tsx` | Adicionar rotas `/afiliado` e `/afiliado/login` |

### Segurança (RLS)
- `commission_payments`: admin pode tudo; afiliada pode SELECT onde `affiliate_id` bate com seu registro
- `affiliates`: nova policy para afiliada ver apenas seu próprio registro via `user_id`
- `orders`: afiliada pode SELECT pedidos onde `affiliate_id` = seu affiliate.id (via subquery)

