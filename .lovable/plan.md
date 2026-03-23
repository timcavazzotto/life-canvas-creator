

## Plano: Ajustar proporção da prévia para combinar com o papel

### Problema raiz
O poster tem largura fixa de `660px`. Com o grid de 80×52 células quadradas, a proporção resultante é ~0.6 (largura/altura). O papel A2/A3 tem proporção ~0.707. Nenhum hack de exportação resolve isso — a prévia precisa **já ter** a proporção correta do papel.

### Solução
Fazer a largura do poster variar conforme o `paperSize` selecionado, de forma que a proporção natural do conteúdo se aproxime da folha. Como A2 e A3 têm a mesma proporção (1:√2), basta uma largura. Remover o hack de achatamento de células no `downloadPDF`.

Cálculo: com padding lateral de 84px e coluna de décadas de 26px, cada célula ≈ `(W - 110) / 52`. A altura do grid ≈ `80 * cellSize + 107` (gaps + decade separators). Mais ~200px de header/footer. Para ratio 0.707: `W / (80 * (W-110)/52 + 307) = 0.707`. Resolvendo: **W ≈ 780px**.

### Alterações

**1. `src/App.css`**
- Alterar `.poster` de `width: 660px` para `width: 780px`
- Ajustar o `transform: scale()` na media query mobile para caber na tela (de 0.52 para ~0.44)

**2. `src/pages/Index.tsx`**
- Remover o bloco de `tempStyle` que achata as células (linhas 35-51 e 56)
- Manter a lógica simples de escala `Math.min(ratioW, ratioH)` — agora ambos ratios serão próximos
- Remover restauração de `boxShadow` complexa, manter apenas `boxShadow: 'none'` temporário

### Resultado
- Prévia na tela já terá proporção próxima à folha A2/A3
- PDF preencherá a folha com margens mínimas sem hacks
- Células permanecem quadradas
- Visual mais largo e elegante

### Arquivos alterados
| Arquivo | Ação |
|---------|------|
| `src/App.css` | Largura do poster: 660px → 780px, ajustar scale mobile |
| `src/pages/Index.tsx` | Remover hack de achatamento de células no downloadPDF |

