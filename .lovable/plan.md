

## Plano: Adicionar formatos de moldura 30×40 e 40×50 mantendo A2/A3

### Resumo
Expandir o seletor de formato para 4 opções: **30×40cm**, **40×50cm**, **A3**, **A2**. O preview HTML ajusta sua proporção conforme o formato selecionado. O PDF inclui 5mm de sangria (bleed) nos formatos de moldura.

### Proporções e alturas (largura fixa 660px)

| Formato | Dimensão (mm) | Ratio (w/h) | Altura preview (px) |
|---------|---------------|-------------|---------------------|
| 30×40   | 300×400       | 0.75        | 880px               |
| 40×50   | 400×500       | 0.80        | 825px               |
| A3      | 297×420       | 0.707       | 933px               |
| A2      | 420×594       | 0.707       | 933px               |

### Alterações

**1. `src/pages/Index.tsx`**
- Tipo de `paperSize`: `'30x40' | '40x50' | 'a3' | 'a2'`, default `'30x40'`
- Mapa de configurações por formato:
  - Dimensões PDF em mm (com bleed de 5mm para molduras, sem bleed para A)
  - Altura do preview em px
- Botões: `30×40 cm` · `40×50 cm` · `A3` · `A2`
- `downloadPDF`: usar `format: [largura_mm, altura_mm]` do mapa
- Passar altura do poster para `PosterPreview` via style ou prop

**2. `src/components/PosterPreview.tsx`**
- Aceitar prop `posterHeight` (number) e aplicar como `style={{ height: posterHeight }}`

**3. `src/App.css`**
- `.poster`: trocar `height: 933px` por height via style inline (removido do CSS)
- Mobile: ajustar `margin-bottom` negativo dinamicamente ou usar valor conservador

**4. `src/data/posterData.ts`**
- Adicionar constante `PAPER_FORMATS` com as 4 opções e suas dimensões

### PDF com sangria (formatos de moldura)
- 30×40: PDF gerado em 310×410mm (5mm bleed cada lado)
- 40×50: PDF gerado em 410×510mm
- A3/A2: PDF gerado nas dimensões padrão, sem bleed

