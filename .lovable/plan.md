

## Plano: Ajustar preview HTML/CSS para proporção real A2/A3

### Problema raiz
O poster HTML (`.poster`) tem `width: 660px` mas **nenhuma altura fixa** — ele cresce conforme o conteúdo. Isso gera uma proporção arbitrária que, ao ser convertida para PDF A2/A3, resulta em margens brancas, desalinhamentos no header e décadas desencaixadas do grid.

A proporção correta de A2 e A3 é idêntica: **1:√2** (largura/altura ≈ 0.7071). Para 660px de largura, a altura deve ser **~933px**.

### Alterações

**1. `src/App.css` — Poster com proporção fixa A2/A3**
- `.poster`: adicionar `height: 933px` e `display: flex; flex-direction: column` para que o conteúdo se distribua verticalmente
- `.pg` (container do grid): `flex: 1; min-height: 0` para que o grid ocupe todo o espaço disponível entre header/footer
- `.grid-wrap`, `.grid-main`, `.year-rows`: `height: 100%` / `flex: 1` para preencher o espaço
- `.wk`: remover `aspect-ratio: 1` (as células se adaptam ao espaço disponível)
- `.decade-col`: remover `padding-top: 16px` (resquício do month-row), usar `display: flex; flex-direction: column` com mesmo gap do year-rows para alinhar com as linhas do grid
- `.dec-lbl`: usar `flex: N` proporcional ao número de linhas da década (via style inline no componente)
- Header: `.ph-eyebrow` margin-bottom para `1px`, `.ph-subtitle` margin-top para `14px`
- `.pf-val`: `padding-bottom: 8px` (mais espaço entre texto e linha inferior)

**2. `src/components/PosterPreview.tsx` — Décadas com flex proporcional**
- Labels de década: trocar `height` calculada em pixels por `flex: d.rows` no style inline
- Remover cálculos hardcoded de `10.3px` e `4px`

**3. `src/pages/Index.tsx` — Seletor de tamanho + PDF sem margens**
- Adicionar `paperSize` ao estado (`'a3' | 'a2'`, default `'a3'`)
- Adicionar botões A2/A3 na sidebar (nova seção ou dentro de "Identidade")
- `downloadPDF`: remover `margin: 10mm`, usar `format: paperSize`, escala calculada para preencher 100% da página
- Preview mobile: ajustar `scale()` se necessário

**4. `src/App.css` — Mobile**
- Ajustar o `scale()` e `margin-bottom` negativo para a nova altura de 933px

### Resultado
- Preview HTML já tem a proporção exata de impressão
- PDF gerado ocupa 100% da folha sem margens brancas
- Décadas alinhadas pixel-perfect com o grid
- Header com espaçamento correto
- Campos pessoais com mais espaço antes da linha

