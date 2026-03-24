

## Plano: Corrigir download do PDF

### Problema
O bucket `order-pdfs` é privado. O cliente tenta criar uma URL assinada usando a chave anon sem sessão autenticada → a operação é rejeitada pelo storage. O PDF existe, mas o botão não consegue gerar o link de download.

### Solução
Criar uma edge function `download-pdf` que recebe o `order_id`, verifica que o pedido está pago, e retorna uma signed URL gerada com a service role key.

### Mudanças

**Nova edge function `supabase/functions/download-pdf/index.ts`**:
- Recebe `{ order_id }` via POST
- Busca o pedido no banco e valida que `status === 'paid'` e `pdf_storage_path` existe
- Gera signed URL com service role key (1h de validade)
- Retorna `{ url }` ao cliente

**`src/pages/ThankYou.tsx`** — Alterar `downloadPdf` para invocar a edge function em vez de chamar storage diretamente:
```typescript
const downloadPdf = async () => {
  const { data } = await supabase.functions.invoke('download-pdf', {
    body: { order_id: orderId },
  });
  if (data?.url) {
    window.open(data.url, '_blank');
  }
};
```

### Arquivos
- `supabase/functions/download-pdf/index.ts` (novo)
- `src/pages/ThankYou.tsx`

