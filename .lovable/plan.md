

## Plano: Redesign editorial — site branco e limpo

### Direção
Transformar o site de dark/gold para um layout **editorial claro**: fundo off-white (#f5f3ef), tipografia escura, acentos sutis em verde musgo ou terracota. Manter Cormorant Garamond + DM Mono. Manter os 6 temas do pôster.

### Mudanças

**`src/App.css`** — reescrever variáveis e cores do site:
- `:root` — trocar `--ink: #0e0c08` por fundo claro `#f5f3ef`, texto escuro `#1a1815`, acento sutil (verde musgo `#4a6b5a` ou terracota `#8b5e3c`)
- `--gold` → `--accent` (verde musgo ou terracota, mais sóbrio que dourado)
- `--border` → cinza sutil `rgba(0,0,0,0.08)`
- `--muted` → `#8a8578`
- `body` → `background: #f5f3ef; color: #1a1815`
- `nav` → fundo claro semi-transparente `rgba(245,243,239,0.92)`, texto escuro
- `.hero` → fundo claro, remover gradiente radial dourado, grid pattern sutil em cinza
- `.how`, `.testimonials`, `.pricing` → fundos alternados entre `#f5f3ef` e `#edeae4`
- `.testi-card`, `.price-card` → fundo branco `#fff`, borda cinza sutil
- Botões (`.btn-hero`, `.nav-cta`, `.cfg-btn-gold`) → fundo acento, texto claro
- `.cfg-sidebar` → fundo escuro mantido OU fundo claro editorial (preferência: claro `#edeae4`)
- `.cfg-preview` → fundo `#e8e5df` (neutro mais escuro que a página)
- Modal → fundo branco, texto escuro
- Footer → fundo `#1a1815` (dark) para contraste, texto claro

**`src/App.css`** — poster themes (manter os 6, apenas refinar levemente os tons para harmonizar com o site claro)

**`src/pages/Index.tsx`** — ajustar inline styles que referenciam cores antigas (ex: `color: 'var(--gold)'` → `color: 'var(--accent)'`)

**`src/components/OrderModal.tsx`** — sem mudança estrutural, herda CSS

**`src/index.css`** — sem mudança (design system do shadcn, não afeta o site custom)

### Resultado
Site com aparência editorial limpa, leve, sofisticada — transmitindo sobriedade e maturidade condizente com o tema "vida em semanas". O pôster continua sendo o protagonista visual.

