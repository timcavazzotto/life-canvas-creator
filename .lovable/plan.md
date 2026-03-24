

## Plano: Corrigir bug de data e download do PDF

### Problema 1: Data seleciona dia anterior
`new Date("1985-06-15")` interpreta como meia-noite UTC → no Brasil (UTC-3) vira dia anterior. Ocorre em 6 locais nos arquivos `Index.tsx` e `PosterPreview.tsx`.

**Solução**: Usar `parse` do `date-fns` para interpretar como data local.

### Problema 2: Botão de download não funciona
O fluxo atual: webhook marca pedido como `paid` → dispara `generate-pdf` de forma assíncrona. Mas o polling na página ThankYou **para assim que detecta `status === 'paid'`** (linha 28). Nesse momento, o PDF ainda não foi gerado, então `pdf_storage_path` é `null`. A página mostra "O PDF está sendo gerado" mas nunca mais verifica.

**Solução**: Continuar polling até que `pdf_storage_path` esteja preenchido (para pedidos digitais).

---

### Mudanças

**`src/pages/Index.tsx`** — Importar `parse` do `date-fns` e substituir `new Date(st.birth)` por `parse(st.birth, 'yyyy-MM-dd', new Date())` nas linhas 61, 252, 259, 264.

**`src/components/PosterPreview.tsx`** — Mesma substituição nas linhas 19 e 68.

**`src/pages/ThankYou.tsx`** — Alterar condição de parar polling (linha 27-28):
```typescript
// Antes:
if (data.status === 'paid') {
  setPolling(false);
}

// Depois:
if (data.status === 'paid' && (data.order_type !== 'digital' || data.pdf_storage_path)) {
  setPolling(false);
}
```

### Arquivos
- `src/pages/Index.tsx`
- `src/components/PosterPreview.tsx`
- `src/pages/ThankYou.tsx`

