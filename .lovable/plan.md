

## Plano: Painel Administrativo

### O que será construído

Um painel admin protegido por login (rota `/admin`) com 4 seções:

### 1. Dashboard de Vendas
- Cards com métricas: total de pedidos, receita total, pedidos pagos vs pendentes
- Gráfico de vendas por período (últimos 7/30/90 dias) usando Recharts
- Tabela de pedidos recentes com status, valor, data, cliente

### 2. Gestão de Afiliados
- Tabela listando todas as afiliadas (nome, código, email, comissão %, ativo/inativo)
- Formulário para adicionar nova afiliada
- Botão para ativar/desativar afiliada
- Edição inline de comissão %

### 3. Analytics de Campanhas
- Vendas por afiliada (ranking de quem mais vende)
- Gráfico de conversão por código de cupom
- Total de comissões pagas/pendentes por afiliada
- Filtro por período

### 4. Autenticação Admin
- Login simples com email/senha (Lovable Cloud Auth)
- Tabela `user_roles` para controle de acesso admin
- Rota `/admin` protegida — redireciona para login se não autenticado
- RLS policies ajustadas para admin poder ler/editar `orders` e `affiliates`

### Mudanças técnicas

- **Banco de dados**: Criar tabela `user_roles`, função `has_role()`, e policies de admin para `orders` e `affiliates`
- **Edge Function**: Nenhuma nova necessária — leitura direta via Supabase client com RLS
- **Novas páginas**: `/admin/login`, `/admin` (dashboard), com sidebar para navegar entre seções
- **Componentes**: `AdminLayout`, `SalesDashboard`, `AffiliateManager`, `CampaignAnalytics`
- **Gráficos**: Recharts (já disponível via shadcn/ui chart)

### Fluxo

```text
/admin/login → autenticação → /admin
                                 ├── Dashboard (vendas, métricas)
                                 ├── Afiliados (CRUD)
                                 └── Analytics (campanhas)
```

