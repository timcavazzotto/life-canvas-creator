

## Plano: Corrigir CSS quebrado, aumentar fontes e ajustar proporção horizontal

### Problemas identificados

1. **Linha 181 — CSS do `.ph` está duplicado/aninhado**: O conteúdo é `.ph { display: flex; ... .ph { display: flex; ... } ... }` — uma regra aninhada erroneamente que causa parsing inconsistente. O subtítulo é cortado por causa do `overflow: hidden` nessa regra malformada.

2. **Fontes pequenas demais**: eyebrow (6.5px), subtitle (6.5px), quote (10px), nome (13px), dedicatória (11.5px), footer labels (5.5px) — todos precisam de aumento.

3. **PDF esticado horizontalmente**: O poster é capturado com `addImage(0, 0, pageW, pageH)` — preenchendo a página inteira. Como o poster tem `aspect-ratio: 1/1.4142` e o papel A3 também, deveria funcionar. Mas a `.paper-sheet` de 800px com o conteúdo real pode ter altura ligeiramente diferente da proporção exata, causando esticamento. Solução: manter a proporção do canvas ao posicionar no PDF.

### Alterações

**`src/App.css`**

1. **Linha 181** — Reescrever `.ph` corretamente (remover duplicação):
```css
.ph { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1.5px solid var(--p-rule, #1e1408); margin-bottom: 16px; }
```
Remover `overflow: hidden` — era isso que cortava o subtítulo.

2. **Aumentar fontes**:
   - `.ph-eyebrow`: 6.5px → 8px
   - `.ph-subtitle`: 6.5px → 8px
   - `.ph-quote`: 10px → 12px
   - `.pf-val` (nome): 13px → 15px
   - `.pf-val.italic` (dedicatória): 11.5px → 13px
   - `.pfs-val` (footer números): 21px → 24px
   - `.pfs-lbl` (footer labels): 5.5px → 7px
   - `.pfb-name`: 13px → 15px
   - `.pfb-tag`: 5.5px → 7px
   - `.pl-note`: 8.5px → 10px

**`src/pages/Index.tsx`**

3. **PDF — manter proporção real do canvas** em vez de esticar para preencher a página:
```typescript
const canvasRatio = canvas.width / canvas.height;
const pageRatio = pageW / pageH;
let w, h, x, y;
if (canvasRatio > pageRatio) {
  w = pageW; h = pageW / canvasRatio; x = 0; y = (pageH - h) / 2;
} else {
  h = pageH; w = pageH * canvasRatio; x = (pageW - w) / 2; y = 0;
}
pdf.addImage(imgData, 'JPEG', x, y, w, h);
```

### Arquivos alterados
| Arquivo | Ação |
|---------|------|
| `src/App.css` | Corrigir `.ph` duplicado, remover overflow:hidden, aumentar fontes |
| `src/pages/Index.tsx` | Manter proporção do canvas no PDF |

