

## Plano: Alinhar título horizontalmente e verticalmente

### Problema
O título "PROJETO 80+" tem `margin-top` implícito do fluxo normal e o subtítulo tem `margin-top: 14px`, empurrando o bloco esquerdo para baixo. O título em 42px cria espaço visual interno que o desalinha tanto horizontalmente (recuado) quanto verticalmente (parece mais baixo que deveria entre o eyebrow e subtitle).

### Solução
Duas correções no `.ph-title` em `src/App.css` (linha 183):

1. **Horizontal**: `margin-left: -2px` — compensar espaço visual da fonte grande
2. **Vertical**: `margin-top: -2px` — subir levemente o título para ficar opticamente centrado entre eyebrow e subtitle

Também reduzir o `margin-top` do subtitle de `14px` para `8px` — o espaço atual é excessivo e contribui para o título parecer deslocado para cima.

### Alterações em `src/App.css`

| Seletor | Propriedade | De | Para |
|---------|------------|-----|------|
| `.ph-title` (L183) | `margin-left` | — | `-2px` |
| `.ph-title` (L183) | `margin-top` | — | `-2px` |
| `.ph-subtitle` (L185) | `margin-top` | `14px` | `8px` |

