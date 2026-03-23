

## Plano: Conteúdo proporcional dentro da folha real

### Problema
A `.paper-sheet` agora tem a proporção correta do papel (1:√2), mas o conteúdo interno do poster usa tamanhos fixos em px (título 42px, textos 13px, paddings de 28px, etc.). No `max-width: 560px`, a altura da folha fica ~792px — insuficiente para acomodar todo esse conteúdo fixo. Resultado: grid achatado e textos cortados pelo `overflow: hidden`.

### Causa raiz
O conteúdo foi desenhado para ~780px de largura. A 560px, o conteúdo não cabe na altura proporcional da folha.

### Solução
Combinar a folha real com escala visual:

1. **`.paper-sheet`** — largura fixa de 800px (onde o conteúdo cabe naturalmente na proporção A-series)
2. **Preview na tela** — escalar a folha com `transform: scale()` + `transform-origin: top center` para caber na área de preview
3. **PDF** — capturar a folha no tamanho real (800px), sem transform. Como a proporção já é a do papel, a imagem preenche a página inteira

### Diferença vs tentativas anteriores
Antes: poster com largura fixa + transform, sem folha → proporção errada no PDF.
Agora: **folha com proporção correta** + poster dentro dela no tamanho natural → PDF correto.

### Alterações

**`src/App.css`**
- `.paper-sheet`: trocar `max-width: 560px` por `width: 800px`, adicionar `transform: scale(0.7)`, `transform-origin: top center`, `margin-bottom` negativo para compensar espaço visual
- Mobile: `transform: scale(0.42)` na `.paper-sheet`
- `.poster`: remover `overflow: hidden` (não é mais necessário com o tamanho correto)

**`src/pages/Index.tsx`**
- No `downloadPDF`: antes do `html2canvas`, temporariamente remover `transform` e `margin-bottom` da `.paper-sheet`, capturar, restaurar

### Resultado
- Preview mostra a folha real, escalada para caber na tela
- Conteúdo não é cortado nem achatado
- PDF preenche a folha inteira sem bordas laterais
- Grid e textos mantêm suas proporções originais

