

## Plano: Tipografia sans-serif moderna + correção de contraste dos botões

### 1. Trocar fonte dos títulos

Substituir **Cormorant Garamond** (serifada) por **Inter** (sans-serif moderna, limpa, boa para editorial) nos títulos e textos do site. Manter **DM Mono** para labels/monospace.

**`index.html`** — trocar o import do Google Fonts:
- Remover `Cormorant+Garamond`
- Adicionar `Inter:wght@300;400;500;600`
- Manter `DM+Mono`

**`src/App.css`** — atualizar `font-family`:
- `body` → `'Inter', sans-serif`
- Todos os elementos que usam `'Cormorant Garamond', serif` → `'Inter', sans-serif`
- Ajustar `font-weight` dos títulos: 300 → 400 ou 500 (sans-serif light é menos legível)
- `.hero-title` — reduzir levemente o tamanho (72px → 64px), weight 600
- `.section-title` — weight 500
- `.step-num span` — mudar de Cormorant para Inter
- `.cfg-field input/select/textarea` — mudar para Inter
- `.modal` inputs — mudar para Inter

### 2. Corrigir contraste dos botões

Problemas identificados:
- **`.price-btn.outline`** — `color: var(--text-mid)` (#4a4640) sobre `border: var(--border)` (muito sutil). Aumentar contraste do texto e da borda.
- **`.btn-hero-ghost`** — borda `rgba(26,24,21,0.18)` muito fraca no fundo claro. Reforçar.
- **`.cfg-btn-ghost`** — mesma situação, borda quase invisível.
- **`.nav-cta`** — OK (accent + branco), mas fonte 8px pode ser pequena. Subir para 9px.

Correções no CSS:
- `.price-btn.outline` → `color: var(--ink); border: 1px solid rgba(0,0,0,0.2)`
- `.btn-hero-ghost` → `color: var(--ink); border: 1px solid rgba(0,0,0,0.25)`
- `.cfg-btn-ghost` → `color: var(--ink); border: 1px solid rgba(0,0,0,0.2)`
- Garantir que todos os botões com `var(--accent)` como fundo mantenham `color: #fff` (já estão OK)

### 3. Poster (fonte interna)

O pôster pode manter Cormorant Garamond para preservar o caráter editorial do impresso — ou mudar também. Vou manter o pôster com a serifada por contraste (site moderno, pôster clássico). Se preferir trocar, ajustamos depois.

### Arquivos alterados
- `index.html` — Google Fonts import
- `src/App.css` — font-family, font-weight, contraste dos botões

