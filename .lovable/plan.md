

## Plano: Reduzir tamanho do modal e fixar cor do botão

### Alterações

**1. `src/App.css` — Reduzir tamanho do modal**
- Adicionar `max-height: 90vh; overflow-y: auto;` no `.modal` para que o modal não ultrapasse a tela
- Reduzir padding de `40px` para `28px`
- Reduzir gaps e margens internas dos campos (`.mform` gap de `11px` para `8px`, `.m-opts` margin-bottom de `20px` para `14px`, `.m-sub` margin-bottom de `24px` para `14px`)
- Reduzir padding do `.m-submit` de `13px` para `10px`
- Reduzir padding dos `.m-opt` de `14px 16px` para `10px 14px`

**2. `src/App.css` — Fixar cor verde no botão "Finalizar pedido"**
- Remover a regra `.m-submit:hover { background: var(--accent-h); }` (ou trocar para manter `var(--accent)`)
- Garantir que o botão mantenha `background: var(--accent)` em todos os estados (hover, focus, active)

**3. Responsivo mobile** — Ajustar `.modal` padding no breakpoint mobile de `24px` para `18px`

