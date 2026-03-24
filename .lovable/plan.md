

## Plano: Checkout completo — campos obrigatórios para NF, código de afiliado e opção impressa desativada

### Resumo
Atualizar o modal de checkout para coletar dados obrigatórios para NF (nome completo, CPF, endereço), manter o campo de código de afiliado funcional, e desativar temporariamente a opção "Quadro Impresso" com tag "Em breve".

### Alterações

**1. Migração: novas colunas na tabela `orders`**
```sql
ALTER TABLE public.orders ADD COLUMN cpf text;
ALTER TABLE public.orders ADD COLUMN full_address text;
```
- `customer_name` já existe e será usado como nome completo
- `cpf` e `full_address` nullable (para não quebrar pedidos antigos)

**2. `src/components/OrderModal.tsx`**
- **Opção Impressa desativada**: card com opacity reduzida, badge "Em breve", clique bloqueado, forçar seleção em "digital"
- **Campos obrigatórios** (novos inputs antes do campo de observações):
  - Nome completo (input text, obrigatório)
  - CPF (input com máscara `000.000.000-00`, salvar apenas dígitos, validar 11 dígitos)
  - Endereço completo (textarea, obrigatório)
- **Código de afiliado**: já existe no modal — manter funcionando como está (input + botão "Aplicar" que valida na tabela `affiliates`)
- **Validação**: nome, email, CPF e endereço obrigatórios antes de submeter
- **Body do `create-checkout`**: enviar `cpf`, `full_address` e `customer_name` (do input, não do posterState)

**3. `supabase/functions/create-checkout/index.ts`**
- Aceitar `cpf` e `full_address` no body da request
- Incluir ambos no `INSERT` da tabela `orders`

**4. `src/pages/admin/OrderManager.tsx`**
- Exibir CPF e endereço completo nos detalhes de cada pedido (visível para o admin)

### Fluxo do código de afiliado (já implementado)
1. Usuário digita código e clica "Aplicar"
2. Frontend consulta tabela `affiliates` por `code` + `active = true`
3. Se válido, exibe "✓ Código de [nome] aplicado!"
4. No submit, envia `affiliate_code` para `create-checkout`
5. Edge Function busca afiliado, calcula `commission_cents` e salva `affiliate_id` + `affiliate_code` no pedido

### Segurança
- CPF salvo apenas como dígitos no banco
- Validação client-side (11 dígitos) + campos obrigatórios
- Dados pessoais acessíveis apenas por admins via RLS existente

