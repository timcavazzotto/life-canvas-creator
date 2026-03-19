

## Plano: Página de Gestão de Pedidos no Admin

### Problema
Hoje o Dashboard mostra apenas um resumo dos pedidos recentes com poucos campos. Você precisa de uma página dedicada para consultar **todos os dados** de cada pedido — nome, email, endereço, observações, configuração do poster, status de pagamento, código de rastreio, etc. — para lidar com devoluções, trocas e suporte.

### O que será feito

1. **Nova página `src/pages/admin/OrderManager.tsx`**
   - Tabela completa com todos os campos do pedido: data, cliente, email, endereço, tipo, valor, status de pagamento, status de impressão, código de rastreio, observações, cupom afiliado
   - Busca por nome/email
   - Filtros por status (paid/pending) e tipo de pedido
   - Modal de detalhes ao clicar no pedido — mostra `poster_config` (dados inseridos pelo cliente) e todos os campos
   - Possibilidade de editar campos como `print_status`, `tracking_code` e `observations` diretamente

2. **Rota e sidebar**
   - Rota `/admin/orders` no `App.tsx`
   - Item "Pedidos" na sidebar (`AdminSidebar.tsx`) com ícone `ShoppingCart`

3. **Query completa**
   - SELECT de todas as colunas da tabela `orders` (já protegida por RLS para admins)

### Arquivos

| Arquivo | Ação |
|---------|------|
| `src/pages/admin/OrderManager.tsx` | Criar — página completa de pedidos |
| `src/App.tsx` | Adicionar rota `/admin/orders` |
| `src/components/admin/AdminSidebar.tsx` | Adicionar item "Pedidos" |

### Sem alterações no banco
As RLS policies existentes já permitem SELECT e UPDATE de `orders` para admins.

