

## Plano: Corrigir alinhamento das décadas com o grid

### Problema raiz
A `decade-col` tem 8 itens flex (um por década) com `gap: 1px`, gerando 7 gaps de 1px (= 7px total). Enquanto isso, `year-rows` tem 80 itens flex com `gap: 1px`, gerando 79 gaps de 1px (= 79px total). Essa diferença de 72px no espaço consumido por gaps faz com que os labels de década fiquem progressivamente desalinhados das linhas do grid.

### Solução
Trocar a abordagem: em vez de 8 itens flex na `decade-col`, renderizar **1 item por ano** (80 itens), com o mesmo `gap` e `flex` que as linhas do grid. Apenas os anos múltiplos de 10 mostram texto; os demais ficam vazios. Isso garante alinhamento pixel-perfect.

### Alterações

**1. `src/components/PosterPreview.tsx`**
- Substituir o `decadeLabels` por um array de 0..expect, onde cada item tem o label apenas se `year % 10 === 0`
- Substituir o bloco JSX da `decade-col` para renderizar um `<div>` por ano (com classe `dec-lbl`), mostrando o número apenas nos múltiplos de 10
- Manter `dec-sep` class nos anos onde `year > 0 && year % 10 === 0`

**2. `src/App.css`**
- `.decade-col`: manter `gap: 1px` (agora terá 79 gaps, igual ao year-rows)
- `.dec-lbl`: manter `flex: 1` (cada label ocupa o mesmo espaço que um `.yr`)
- `.dec-lbl.dec-sep`: manter `margin-top: 4px` (idêntico ao `.yr.dec-sep`)

### Resultado
- Cada label de década ocupa exatamente a mesma altura que a linha do grid correspondente
- Gaps idênticos entre decade-col e year-rows
- Separações de década (`dec-sep`) perfeitamente sincronizadas

