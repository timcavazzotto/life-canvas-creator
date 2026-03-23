

## Plano: Alinhar eyebrow com título e subir título

### Alterações em `src/App.css`

**1. Alinhar eyebrow lateralmente com o título (linha 182)**
- `.ph-eyebrow`: adicionar `margin-left: -2px` para ficar no mesmo alinhamento lateral que o `.ph-title`

**2. Subir o título para alinhar com a frase motivacional (linha 183)**
- `.ph-title`: alterar `margin-top: -2px` → `margin-top: -6px` para subir e ficar na mesma altura visual da quote à direita

### Arquivo alterado
| Arquivo | Ação |
|---------|------|
| `src/App.css` | `margin-left: -2px` no eyebrow, `margin-top: -6px` no título |

