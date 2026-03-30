

## Plano: Destaque verde no painel selecionado

### Problema
O botão do painel selecionado usa `var(--fg)` como fundo (cor escura genérica), ficando sem destaque visual claro. Deve usar o verde musgo (`#365545`) — mesma cor do botão "Quero meu painel".

### Mudança

**`src/pages/Index.tsx`** (linhas 252-256)

Trocar os estilos do botão ativo:
- `background`: de `var(--fg)` para `#365545` (verde musgo, mesma cor do CTA primário)
- `color`: manter `#fff` (branco)
- `border`: de `1.5px solid var(--fg)` para `1.5px solid #365545`

Resultado: o painel selecionado fica com fundo verde e texto branco, com destaque claro e consistente com o design system.

