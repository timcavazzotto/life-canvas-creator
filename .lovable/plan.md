

## Plano: PDF fiel ao preview usando captura client-side

### Problema raiz
Existem **dois caminhos de geração de PDF** completamente diferentes:

1. **Client-side** (`Index.tsx` linha 22-41): Usa `html2canvas` para capturar o poster HTML exato → gera PDF perfeito com `jsPDF.addImage()`. Só funciona no botão "Baixar PDF" da tela de edição.

2. **Server-side** (edge function `generate-pdf`): Recria o poster do zero usando coordenadas manuais no jsPDF (Helvetica, posições fixas em mm). É chamada após o pagamento. **Nunca vai ser igual ao preview** porque é um rendering completamente diferente — fontes diferentes, espaçamentos diferentes, layout diferente.

O PDF que o cliente baixa após pagar vem do caminho 2, por isso está desconfigurado.

### Solução
Gerar o PDF **client-side** (usando html2canvas, que já funciona perfeitamente) e fazer upload **antes** de redirecionar ao pagamento. A edge function `generate-pdf` vira desnecessária.

### Mudanças

**`src/components/OrderModal.tsx`**:
- Receber `posterRef` como prop (referência ao elemento DOM do poster)
- Antes de redirecionar ao pagamento, capturar o poster com `html2canvas` (scale: 4)
- Gerar o PDF com `jsPDF.addImage()` (mesmo código da função `downloadPDF` em Index.tsx)
- Fazer upload do PDF para o bucket `order-pdfs` via edge function `upload-poster-pdf`
- Incluir o `pdf_storage_path` no body do `create-checkout`

**`src/pages/Index.tsx`**:
- Passar `posterRef` para o `OrderModal`

**Nova edge function `supabase/functions/upload-poster-pdf/index.ts`**:
- Recebe o PDF como base64 + um identificador temporário
- Faz upload para o bucket `order-pdfs` usando service role key
- Retorna o path do arquivo

**`supabase/functions/create-checkout/index.ts`**:
- Aceitar `pdf_storage_path` opcional no body
- Salvar no registro do pedido ao criar

**`supabase/functions/payment-webhook/index.ts`**:
- Se `pdf_storage_path` já existe, não chamar `generate-pdf`

### Resultado
O PDF baixado após o pagamento será **idêntico** ao preview que o usuário vê na tela, pois é gerado a partir da mesma renderização HTML.

### Arquivos
- `src/components/OrderModal.tsx`
- `src/pages/Index.tsx`
- `supabase/functions/upload-poster-pdf/index.ts` (novo)
- `supabase/functions/create-checkout/index.ts`
- `supabase/functions/payment-webhook/index.ts`

