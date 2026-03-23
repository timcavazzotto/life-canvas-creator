

## Plano: Ajustar largura do poster para preencher a folha no PDF

### Problema raiz
O poster HTML tem 660px de largura fixa, mas sua altura total (com grid de 80 anos × 52 semanas) cria uma proporção mais "alta e estreita" que o papel A3 (297×420mm, ratio ~0.707). O código de escala já prioriza a largura, mas como `canvas.height * ratioW > usableH`, ele recua para `ratioH` — e a largura volta a ficar estreita.

### Solução
Antes de capturar com `html2canvas`, **temporariamente redimensionar o poster** para ter a proporção exata do papel selecionado. Isso garante que o canvas capturado preencha a folha inteira.

### Alterações em `src/pages/Index.tsx` (função `downloadPDF`)

1. Antes do `html2canvas`, calcular a largura ideal do poster para a proporção do papel:
   - Obter a altura atual do elemento (`el.scrollHeight`)
   - Calcular a largura proporcional: `targetWidth = el.scrollHeight * (pageW / pageH)`
   - Temporariamente setar `el.style.width = targetWidth + 'px'`

2. Após capturar o canvas, restaurar a largura original (660px)

3. Manter a escala pelo `Math.min(ratioW, ratioH)` — agora ambos serão praticamente iguais, pois a proporção já bate

### Código aproximado
```typescript
// Temporariamente ajustar proporção do poster ao papel
const origWidth = el.style.width;
const paperRatio = pageW / pageH;
const currentH = el.scrollHeight;
const targetW = Math.round(currentH * paperRatio);
el.style.width = targetW + 'px';

// Aguardar re-layout
await new Promise(r => setTimeout(r, 100));

const canvas = await html2canvas(el, { scale: 4, useCORS: true });

// Restaurar
el.style.width = origWidth;
```

### Resultado
O poster será capturado com proporção idêntica à da folha, eliminando margens laterais excessivas no PDF.

