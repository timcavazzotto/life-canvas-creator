

## Plano: Aumentar espaço entre texto e linha inferior nos campos do poster

### Problema
No PDF, os campos Nome, Nascimento e Expectativa de vida têm o texto muito colado na linha inferior (`border-bottom`). Atualmente o `padding-bottom` é apenas `3px`.

### Solução
Aumentar o `padding-bottom` de `.pf-val` em `src/App.css` de `3px` para `8px`. Como o PDF é gerado via html2canvas (captura do HTML renderizado), essa mudança se aplica automaticamente ao PDF.

### Arquivo alterado
- `src/App.css` — linha 189: alterar `padding-bottom: 3px` para `padding-bottom: 8px`

