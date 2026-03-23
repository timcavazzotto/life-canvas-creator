

## Plano: Realinhar header do poster

### Problema
O header usa `align-items: center` no `.ph`, mas o lado esquerdo tem 3 elementos (eyebrow, título, subtitle) com `margin-left: -2px` e `margin-top: -6px` que criam desalinhamento visual inconsistente. Os ajustes incrementais com margens negativas não resolveram o problema fundamental: os dois lados do header precisam alinhar pelo topo, não pelo centro.

### Solução
Redesenhar o alinhamento do header de forma limpa:

1. **`.ph`**: trocar `align-items: center` para `align-items: flex-start` — ambos os lados alinham pelo topo
2. **Remover todas as margens negativas** de compensação (`margin-left: -2px`, `margin-top: -6px`) do eyebrow e título — não são mais necessárias com alinhamento pelo topo
3. **`.ph-right`**: adicionar `padding-top: 2px` para compensação fina se necessário
4. **`.ph-title`**: manter `line-height: 1` mas remover hacks de posicionamento

### Alterações em `src/App.css`

| Seletor | De | Para |
|---------|-----|------|
| `.ph` (L181) | `align-items: center` | `align-items: flex-start` |
| `.ph-eyebrow` (L182) | `margin-left: -2px` | remover |
| `.ph-title` (L183) | `margin-left: -2px; margin-top: -6px` | remover ambos |
| `.ph-right` (L186) | — | `padding-top: 2px` |

O alinhamento pelo topo garante que o eyebrow (lado esquerdo) e a quote (lado direito) começam na mesma linha. O título e subtitle fluem naturalmente abaixo. Sem hacks de margem negativa.

### Arquivo alterado
| Arquivo | Ação |
|---------|------|
| `src/App.css` | Alinhar header pelo topo, remover margens negativas |

