

## Plano: Forçar download direto do PDF

### O que está acontecendo

O botão "Baixar PDF" usa `window.open(url, '_blank')` com uma URL assinada do Storage. Como o navegador reconhece PDFs, ele **abre no viewer interno** em vez de baixar. **Não afeta a qualidade** — o arquivo é idêntico, só muda o comportamento de entrega.

### Solução

Duas mudanças:

1. **Edge Function `download-pdf`**: Usar `createSignedUrl` com a opção `download: true`, que adiciona o header `Content-Disposition: attachment` na URL assinada. Isso força o navegador a baixar.

2. **`ThankYou.tsx`**: Trocar `window.open` por `window.location.href` (ou criar um `<a>` invisível com `download`), para que o navegador trate como download em vez de navegação.

### Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `supabase/functions/download-pdf/index.ts` | Passar `{ download: 'poster.pdf' }` no `createSignedUrl` |
| `src/pages/ThankYou.tsx` | Usar `window.location.href = url` ou link com atributo download |

