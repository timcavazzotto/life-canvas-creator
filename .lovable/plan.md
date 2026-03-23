

## Plano: Ajustar prévia na tela e corrigir PDF

### Problema 1 — Prévia grande demais na tela
O poster tem `780px` de largura fixa. No desktop, o painel de prévia (`cfg-preview`) não escala o poster, então ele transborda ou exige scroll. No mobile, o `scale(0.44)` pode não ser suficiente.

### Problema 2 — Bordas laterais no PDF
O `downloadPDF` usa `Math.min(ratioW, ratioH)` — como a altura do poster ainda domina, o fator de altura é menor e as laterais ficam vazias.

### Solução

**1. Desktop: escalar o poster dentro da área de prévia**
Usar CSS `transform: scale()` no desktop também, para que o poster de 780px caiba na área visível. A `cfg-preview` tem `flex: 1` (~700-780px de largura disponível). Um `scale(0.85)` fará o poster caber sem scroll.

**2. Mobile: ajustar escala**
Reduzir de `scale(0.44)` para `scale(0.42)` e ajustar `margin-bottom` proporcionalmente.

**3. PDF: priorizar preenchimento pela largura**
Trocar a lógica de escala de `Math.min()` para priorizar a largura: usar `ratioW` e, se a altura estourar, recuar para `ratioH`. Posicionar no topo (margem 3mm) em vez de centralizado verticalmente.

### Alterações

**`src/App.css`**
- Adicionar ao `.poster` (desktop): `transform: scale(0.85); transform-origin: top center; margin-bottom: -120px;`
- Mobile: ajustar `scale(0.42)` e `margin-bottom: -400px`

**`src/pages/Index.tsx`**
- Na função `downloadPDF`, trocar a lógica de escala:
```typescript
const ratioW = usableW / canvas.width;
const ratioH = usableH / canvas.height;
const ratio = (canvas.height * ratioW <= usableH) ? ratioW : ratioH;
const w = canvas.width * ratio;
const h = canvas.height * ratio;
pdf.addImage(imgData, 'PNG', (pageW - w) / 2, margin, w, h);
```
Isso posiciona o poster no topo com largura máxima. Se ainda couber na altura, usa a largura total.

### Arquivos alterados
| Arquivo | Ação |
|---------|------|
| `src/App.css` | Escalar poster no desktop e ajustar mobile |
| `src/pages/Index.tsx` | Priorizar largura na escala do PDF |

