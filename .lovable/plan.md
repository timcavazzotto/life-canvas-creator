

## Plano: Poster responsivo no mobile sem scroll horizontal

### Problema
No mobile, o poster mantém `width: 660px` com `transform: scale(0.52)` e `margin-bottom: -400px`. Isso causa scroll horizontal porque o elemento ainda ocupa 660px de layout antes do scale. O `overflow-x: hidden` no `.cfg-preview` nem sempre impede o scroll no body.

### Solução
Usar uma abordagem de container com `overflow: hidden` e escala dinâmica baseada na largura da viewport, sem alterar as dimensões internas do poster (preservando a exportação PDF).

### Mudança

**`src/App.css`** (media query mobile, linhas 391-392)

1. Envolver a lógica de escala do poster: manter `width: 660px` no `.poster` (necessário para PDF), mas garantir que `.cfg-preview` tenha `overflow: hidden` e `max-width: 100vw`
2. Ajustar o scale e margin-bottom dinamicamente — usar `scale(0.48)` com `margin-bottom` proporcional para telas menores
3. Adicionar ao `.cfg-preview` no mobile: `max-width: 100vw; overflow: hidden;` para cortar qualquer overflow

**Mudança concreta na media query `@media (max-width: 767px)`:**
```css
.cfg-preview { 
  width: 100%; 
  overflow: hidden;  /* já tem overflow-x: hidden, mudar para overflow: hidden */
  padding: 16px 0 32px;  /* reduzir padding lateral para 0 */
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  max-width: 100vw;
}
.poster { 
  width: 660px; 
  transform: scale(0.48); 
  transform-origin: top center; 
  margin-bottom: -420px; 
}
```

Isso mantém o poster em 660px para exportação PDF mas visualmente o escala para caber na tela mobile sem scroll horizontal.

### Arquivo modificado
| Arquivo | Mudança |
|---|---|
| `src/App.css` | Ajustar overflow e scale do poster no mobile |

