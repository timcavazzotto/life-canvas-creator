

## Plano: Ajustes visuais no poster

### Alterações

**1. `src/App.css`**

- **Título centralizado no header**: O `.ph` usa `align-items: flex-end`, alinhando tudo na base. Trocar para `align-items: center` para que o título fique centrado verticalmente entre o eyebrow e o subtitle, alinhado com a quote à direita.

- **Remover itálico das frases**: 
  - `.ph-quote` (linha 187): remover `font-style: italic`
  - `.pl-note` (linha 215): remover `font-style: italic`
  - `.pf-val.italic` (linha 193): remover `font-style: italic`

**2. `src/components/PosterPreview.tsx`**

- **Dedicatória**: Remover a classe `italic` do `<div className="pf-val italic">` (linha 80) → `<div className="pf-val">`

### Resumo das mudanças

| Arquivo | Linha | Mudança |
|---------|-------|---------|
| `src/App.css` | 181 | `align-items: flex-end` → `align-items: center` |
| `src/App.css` | 187 | Remover `font-style: italic` de `.ph-quote` |
| `src/App.css` | 193 | Remover `font-style: italic` de `.pf-val.italic` |
| `src/App.css` | 215 | Remover `font-style: italic` de `.pl-note` |
| `src/components/PosterPreview.tsx` | 80 | `pf-val italic` → `pf-val` |

