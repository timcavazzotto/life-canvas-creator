

## Plano: Corrigir alinhamento dos labels de décadas com o grid

### Problema
Os labels de décadas (0, 10, 20...) usam altura fixa calculada em pixels (`rows * 10.3px + 4px`). Esse valor foi calibrado para a largura antiga de 660px. Com a folha de 800px, cada célula do grid tem tamanho diferente (determinado por `repeat(52, 1fr)` + `aspect-ratio: 1`), e os labels não acompanham mais.

### Solução
Remover a altura fixa em pixels dos labels de décadas e usar o mesmo sistema de layout do grid: cada label de década ocupa exatamente o mesmo espaço vertical que 10 linhas do grid (incluindo gaps e separadores de década).

**Abordagem**: Trocar a `decade-col` de heights fixos para um layout flex/grid que espelhe o `year-rows`. Cada label terá `flex` proporcional ao número de linhas que representa, e o container será alinhado com o grid via `align-items: stretch`.

### Alterações

**`src/components/PosterPreview.tsx`**
- Remover os `style={{ height: ..., paddingTop: ... }}` inline dos `dec-lbl`
- Cada `dec-lbl` recebe `style={{ gridRow: 'span N' }}` ou simplesmente usa flex com proporção baseada em `d.rows`

**`src/App.css`**
- `.decade-col`: usar `display: flex; flex-direction: column` (já tem), remover `padding-top: 16px`
- `.dec-lbl`: usar `flex: N` onde N = número de linhas, alinhando verticalmente ao início. Adicionar margin-top de 4px nos separadores de década (exceto o primeiro)

### Arquivo alterado
| Arquivo | Ação |
|---------|------|
| `src/components/PosterPreview.tsx` | Remover heights fixos, usar flex proportion |
| `src/App.css` | Ajustar `.decade-col` e `.dec-lbl` para flex proporcional |

