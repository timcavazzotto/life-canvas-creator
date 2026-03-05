

## Plano: Corrigir sobreposição de títulos no PDF

### Problema
O `html2canvas` renderiza `line-height` e fontes de forma ligeiramente diferente do browser. O `.ph-title` com `line-height: 0.92` e o `.pfs-val` com `line-height: 1` ficam "caídos" no PDF, sobrepondo os elementos abaixo.

### Solução — `src/App.css`

Ajustar as propriedades dos elementos que causam sobreposição no PDF:

1. **`.ph-title`** (linha 180): Mudar `line-height: 0.92` → `line-height: 1` e adicionar `padding-bottom: 2px` para dar respiro
2. **`.ph`** (linha 178): Aumentar `padding-bottom: 13px` → `padding-bottom: 16px` para mais espaço entre o header e o conteúdo abaixo
3. **`.ph-subtitle`** (linha 182): Aumentar `margin-top: 7px` → `margin-top: 9px`
4. **`.pfs-val`** (linha 214): Mudar `line-height: 1` → `line-height: 1.15` para evitar que os números do footer sobreponham os labels
5. **`.pfoot`** (linha 213): Aumentar `padding-top: 11px` → `padding-top: 14px`

Estas alterações são pequenas o suficiente para não afetar visualmente o HTML, mas dão margem para o html2canvas renderizar sem sobreposição.

### Arquivo alterado
- `src/App.css` — 5 propriedades ajustadas

