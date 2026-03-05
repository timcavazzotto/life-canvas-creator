

## Plano: Responsividade mobile end-to-end

Atualmente o site não tem nenhuma media query para mobile — tudo é layout desktop fixo. Vou adicionar responsividade completa.

### Mudanças

**1. `src/App.css` — Adicionar bloco `@media (max-width: 768px)`**

Seção por seção:

- **Nav**: Esconder `.nav-links` (links textuais), manter logo + CTA. Reduzir padding para `0 20px`.
- **Hero**: Empilhar verticalmente (`flex-direction: column`), padding `0 20px`, `.hero-left` full width, `.hero-right` full width. `.demo-poster` reduzir para `width: 100%; max-width: 340px`. `.hero-title` para ~40px. `.hero-proof` wrap em 2 colunas.
- **How**: Padding `60px 20px`. `.steps` empilhar verticalmente. Esconder a linha decorativa `::before`.
- **Testimonials**: Padding `60px 20px`. `.testi-grid` para 1 coluna.
- **Pricing**: Padding `60px 20px`. `.pricing-cards` empilhar verticalmente, cards full width.
- **Configurator**: `.config-body` empilhar verticalmente. `.cfg-sidebar` full width, sem altura fixa. `.cfg-preview` full width. `.poster` escalar via `transform: scale()` ou `width: 100%` com overflow scroll horizontal. `.config-header` empilhar, padding menor.
- **Footer**: Empilhar, padding `32px 20px`, text-align center.
- **Modal**: Padding `24px`, full width.

**2. `src/pages/Index.tsx` — Adicionar menu hamburger mobile**

- Adicionar estado `menuOpen` e botão hamburger visível apenas em mobile (via classe CSS).
- Ao clicar, exibir os nav-links em coluna (overlay ou dropdown).

### Arquivos alterados
- `src/App.css` — media queries (~80 linhas)
- `src/pages/Index.tsx` — hamburger menu state + markup

