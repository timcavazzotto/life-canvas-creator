

## Plano: Fluxo completo de checkout com InfinitePay

### Resumo do fluxo
1. Usuario clica "Finalizar pedido" no modal
2. Edge Function cria pedido no banco e chama `POST https://api.infinitepay.io/invoices/public/checkout/links`
3. Frontend redireciona para a URL de pagamento da InfinitePay
4. Após pagar, InfinitePay redireciona para `/obrigado?order_nsu=xxx`
5. Webhook da InfinitePay chama nossa Edge Function para confirmar pagamento
6. Pagina de obrigado consulta status do pedido e libera download do PDF

### Pré-requisito: InfiniteTag (handle)
A API da InfinitePay nao usa API key tradicional - usa a **InfiniteTag** (handle) da conta. Precisarei solicitar esse dado como secret antes de implementar.

### Alterações

**1. Secret `INFINITEPAY_HANDLE`**
- Solicitar ao usuario via `add_secret`
- Substituir o antigo `INFINITEPAY_API_KEY` por `INFINITEPAY_HANDLE`

**2. `supabase/functions/create-checkout/index.ts`**
- Chamar `POST https://api.infinitepay.io/invoices/public/checkout/links` com payload:
  ```json
  {
    "handle": "<INFINITEPAY_HANDLE>",
    "items": [{ "quantity": 1, "price": amount_cents, "description": "Painel Projeto 80+" }],
    "order_nsu": order.id,
    "redirect_url": "https://<site>/obrigado",
    "webhook_url": "https://<supabase>/functions/v1/payment-webhook",
    "customer": { "name": "...", "email": "..." }
  }
  ```
- Salvar `payment_url` retornada no pedido
- Retornar `payment_url` para o frontend

**3. `supabase/functions/payment-webhook/index.ts`**
- Adaptar para o formato real do webhook InfinitePay:
  - Campos recebidos: `order_nsu`, `transaction_nsu`, `invoice_slug`, `amount`, `paid_amount`, `capture_method`
  - Usar `order_nsu` (que é o `order.id`) para localizar o pedido
  - Atualizar status para "paid", salvar `transaction_nsu` como `payment_id`
  - Responder `200 OK` rapidamente
- Manter lógica existente de chamar `send-to-printer` para pedidos "impresso"

**4. Nova pagina `src/pages/ThankYou.tsx`**
- Rota: `/obrigado`
- Lê `order_nsu` dos query params (InfinitePay envia de volta na redirect_url)
- Polling: consulta status do pedido a cada 3s via Edge Function `check-order-status`
- Estados:
  - "Processando pagamento..." (enquanto status = pending)
  - "Pagamento confirmado!" + botao "Baixar PDF" (quando status = paid e order_type = digital)
  - "Pagamento confirmado! Seu quadro sera enviado em breve." (quando impresso)

**5. Nova Edge Function `supabase/functions/check-order-status/index.ts`**
- Recebe `order_id` no body
- Retorna `{ status, order_type, pdf_storage_path }` do pedido
- Sem autenticação (público, mas só retorna dados limitados)

**6. `src/components/OrderModal.tsx`**
- No `handleSubmit`: quando receber `payment_url`, redirecionar com `window.location.href`
- Remover fallback de sucesso (agora sempre terá URL de pagamento)

**7. `src/App.tsx`**
- Adicionar rota `/obrigado` com componente `ThankYou`

**8. Migração: coluna `order_nsu`**
- Nao necessária - vamos usar o proprio `id` do pedido como `order_nsu`

### Segurança
- O webhook responde apenas com 200/400, nao expõe dados
- `check-order-status` retorna apenas status e tipo, sem dados pessoais
- Futuramente pode-se validar `transaction_nsu` via `payment_check` endpoint da InfinitePay

### Diagrama do fluxo
```text
Frontend                  Edge Function              InfinitePay
   |                          |                          |
   |-- POST create-checkout ->|                          |
   |                          |-- POST /checkout/links ->|
   |                          |<-- { checkout_url } -----|
   |<-- { payment_url } -----|                          |
   |                          |                          |
   |== redirect to InfinitePay ========================>|
   |                          |                          |
   |<== redirect to /obrigado?order_nsu=xxx ============|
   |                          |                          |
   |                          |<-- POST webhook ---------|
   |                          |-- update order "paid" -->|
   |                          |-- 200 OK --------------->|
   |                          |                          |
   |-- poll check-order ----->|                          |
   |<-- { status: "paid" } ---|                          |
   |                          |                          |
   |  [Download PDF button]   |                          |
```

