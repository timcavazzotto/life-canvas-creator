

## Plano: Ajustar proporção do poster para preencher a folha no PDF

### Problema raiz
O grid tem 80 linhas de 52 células **quadradas** (`aspect-ratio: 1`). Isso trava a proporção do poster em ~0.57 (largura/altura), que é mais estreita que o papel A3 (~0.707) ou A2 (~0.707). Quando se alarga o poster temporariamente, as células quadradas ficam maiores em ambas as dimensões — a proporção não muda. Por isso as tentativas anteriores não funcionaram.

### Solução
Antes de capturar com `html2canvas`, injetar um `<style>` temporário que muda as células do grid de quadradas para retangulares (mais largas que altas), calculando a proporção exata para que o poster inteiro se encaixe na folha. Após a captura, remover o style.

### Lógica de cálculo
1. Medir a altura do poster atual e a altura do grid
2. Calcular quanto o grid precisa "encolher" em altura para que o poster todo tenha a proporção do papel
3. Definir `aspect-ratio` das células `.wk` como um valor > 1 (ex: ~1.4) para achatar o grid
4. Após captura, restaurar tudo

### Alterações em `src/pages/Index.tsx` (função `downloadPDF`)

Substituir o bloco de redimensionamento temporário por:

```typescript
// Calcular proporção ideal
const paperRatio = (pageW - margin * 2) / (pageH - margin * 2);
const currentRatio = el.offsetWidth / el.scrollHeight;

// Injetar style temporário para achatar as células do grid
const tempStyle = document.createElement('style');
if (currentRatio < paperRatio) {
  // Poster é mais estreito que o papel — achatar células
  const targetH = el.offsetWidth / paperRatio;
  const gridEl = el.querySelector('.year-rows');
  const nonGridH = el.scrollHeight - (gridEl?.scrollHeight || 0);
  const targetGridH = targetH - nonGridH;
  const currentGridH = gridEl?.scrollHeight || 1;
  const cellRatio = currentGridH / targetGridH; // >1 = achatar
  tempStyle.textContent = `.poster .wk { aspect-ratio: ${cellRatio.toFixed(3)} / 1 !important; }`;
  document.head.appendChild(tempStyle);
  await new Promise(r => setTimeout(r, 150));
}

const canvas = await html2canvas(el, { scale: 4, useCORS: true });
tempStyle.remove();
```

### Resultado
- As células do grid ficam ligeiramente retangulares (mais largas que altas) apenas no PDF
- O poster preenche a folha inteira com margens mínimas (3mm)
- A pré-visualização na tela não é afetada
- Visualmente sutil — as células são tão pequenas que a diferença é imperceptível

### Arquivo alterado
| Arquivo | Ação |
|---------|------|
| `src/pages/Index.tsx` | Reescrever bloco de redimensionamento na função `downloadPDF` |

