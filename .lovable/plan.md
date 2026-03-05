

## Plano: Corrigir quadrado vazio da legenda "Por viver"

### Problema
O quadrado `.pl-cell.c-future` tem `border: 0.5px solid` (herdado de `.pl-cell`) com `border-style: dashed`. A borda de 0.5px tracejada é praticamente invisível na maioria dos renders — especialmente no mobile com scale 0.52.

### Solução — `src/App.css`

Aumentar a espessura da borda do quadrado da legenda "future" para que fique visível:

```css
.pl-cell.c-future { border-color: var(--p-future, #c8c4b8); border-style: dashed; border-width: 1px; }
```

Mudar de `0.5px` (herdado) para `1px` explícito. Isso torna o quadrado tracejado claramente visível.

### Arquivo alterado
- `src/App.css` — linha 210, adicionar `border-width: 1px`

