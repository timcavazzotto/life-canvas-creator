

## Plano: Corrigir poster no configurador mobile

### Problema
Na linha 326, o poster tem `width: 100%; min-width: 500px` — isso força o poster a ter no mínimo 500px, ultrapassando a tela mobile (tipicamente 375px). O resultado é scroll horizontal e o poster cortado.

### Solução

**`src/App.css`** — Alterar a abordagem do poster mobile:

- Remover `min-width: 500px` do `.poster`
- Usar `transform: scale()` para escalar o poster proporcionalmente dentro da tela, mantendo legibilidade
- Wrapper com `transform-origin: top center` para que o poster encolha sem quebrar layout

```css
/* Linha 325-326 — substituir por: */
.cfg-preview { width: 100%; overflow-x: hidden; padding: 16px 8px 32px; display: flex; flex-direction: column; align-items: center; }
.poster { width: 660px; transform: scale(0.52); transform-origin: top center; margin-bottom: -300px; padding: 38px 42px 32px; }
```

O scale de ~0.52 faz o poster de 660px caber em ~343px (largura útil de um iPhone). O `margin-bottom` negativo compensa o espaço "fantasma" criado pelo scale. Os valores exatos serão ajustados para ficarem perfeitos.

### Arquivos alterados
- `src/App.css` — 2 linhas no bloco mobile

