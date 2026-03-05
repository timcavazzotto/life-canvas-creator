

## Plano: Melhorar resolução do PDF e corrigir alinhamentos

### 1. Aumentar resolução do PDF

Atualmente o `html2canvas` usa `scale: 4` (linha 24 de Index.tsx). Para atingir >600 dpi num A3 (420×297mm), precisamos de muito mais pixels. A 600 dpi, a largura do A3 é ~9921px. Com o poster tendo ~660px de largura CSS, precisamos `scale: 15` (660×15 = 9900px). Também vamos usar compressão JPEG de alta qualidade no `addImage` para manter o arquivo gerenciável.

**`src/pages/Index.tsx`** — linha 24-26:
- `scale: 4` → `scale: 15`
- Usar `canvas.toDataURL('image/jpeg', 1.0)` em vez de PNG para reduzir tamanho do arquivo mantendo qualidade máxima
- Ou manter PNG se o tamanho não for problema — vamos manter PNG para qualidade máxima

### 2. Corrigir alinhamentos para consistência HTML↔PDF

O `html2canvas` tem problemas conhecidos com:
- **`letter-spacing`** em fontes pequenas — causa deslocamentos sutis
- **`line-height` fracionários** — renderiza diferente do browser
- **`border` fracionários** (0.5px, 0.75px) — arredondados diferente

Ajustes em **`src/App.css`**:

- **`.ph`** (header): Adicionar `overflow: hidden` para conter elementos internos
- **`.ph-eyebrow`**: Mudar `letter-spacing: 0.28em` → `0.2em` (reduz drift)
- **`.pf-val`**: Mudar `border-bottom: 0.75px` → `1px` (renderização consistente)
- **`.pf-label`**: Mudar `letter-spacing: 0.22em` → `0.18em`
- **`.pl-text`**: Mudar `letter-spacing: 0.1em` → `0.08em`
- **`.pfs-lbl`**: Mudar `letter-spacing: 0.14em` → `0.12em`
- **`.wk`** (cells): Mudar `border: 0.5px` → `border: 1px` para renderização consistente no html2canvas

### 3. Adicionar `will-change` e preparação para captura

No `downloadPDF`, antes de capturar, forçar layout flush:
```js
el.style.willChange = 'transform';
void el.offsetHeight; // force reflow
```

### Arquivos alterados
- `src/pages/Index.tsx` — scale 4→15, force reflow antes da captura
- `src/App.css` — ~7 propriedades ajustadas para consistência de renderização

