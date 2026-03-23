

## Plano: Corrigir margens laterais no PDF

### Problema
O poster tem proporção mais estreita que o papel A3/A2. O `Math.min()` na escala escolhe o fator de altura (menor), fazendo a imagem caber na altura mas ficando estreita demais — sobrando ~40mm de margem lateral.

### Solução
Escalar prioritariamente pela **largura** (`usableW / canvas.width`), e se a altura ultrapassar a página, recalcular pela altura. Mas o principal ajuste é: o poster no HTML precisa ter proporção mais próxima do papel, ou a escala deve priorizar preencher a largura total.

A abordagem mais simples: usar `Math.min` como está, mas **ajustar a largura do poster renderizado** para ser proporcional ao papel antes de capturar com html2canvas. Alternativamente, escalar para preencher a largura e deixar o excesso de altura cortar ou ajustar.

**Abordagem escolhida**: Escalar pela largura (`usableW / canvas.width`) e posicionar o topo do poster no topo da página (com margem de 3mm). Se a altura exceder a página, reduzir a escala.

### Alteração

**`src/pages/Index.tsx`** — função `downloadPDF` (~linha 39-42):
- Calcular `ratio` priorizando a largura: `usableW / canvas.width`
- Verificar se `h` resultante cabe em `usableH`; se não, usar `usableH / canvas.height`
- Posicionar horizontalmente centralizado, verticalmente no topo (margem 3mm) em vez de centralizado

```
const ratioW = usableW / canvas.width;
const ratioH = usableH / canvas.height;
const ratio = (canvas.height * ratioW <= usableH) ? ratioW : ratioH;
const w = canvas.width * ratio;
const h = canvas.height * ratio;
pdf.addImage(imgData, 'PNG', (pageW - w) / 2, margin, w, h);
```

### Resultado
O poster preencherá a largura total da folha (com 3mm de margem), eliminando as bordas laterais excessivas.

