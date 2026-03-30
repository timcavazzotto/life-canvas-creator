

## Plano: Trocar emojis por ícones Lucide discretos

### Problema
Os ícones dos painéis usam emojis coloridos (🏃🙏💍🎓🎨📚👥) que destoam do design editorial monocromático do site.

### Solução
Substituir os emojis por ícones Lucide React em tamanho pequeno (14-16px), monocromáticos, que herdam a cor do texto.

### Mudanças

**`src/data/panelTypes.ts`**
- Mudar o tipo de `icon: string` (emoji) para `icon: string` (nome do ícone Lucide)
- Mapping:
  - `movimento` → `"activity"` (Activity)
  - `espiritual` → `"sparkles"` (Sparkles)
  - `casal` → `"heart"` (Heart)
  - `prosperidade` → `"trending-up"` (TrendingUp)
  - `lazer` → `"palette"` (Palette)
  - `leitura` → `"book-open"` (BookOpen)
  - `social` → `"users"` (Users)

**`src/pages/Index.tsx`**
- Importar os ícones Lucide necessários
- No seletor de painéis, trocar o `<span>` do emoji por o componente Lucide correspondente com `size={14}` e cor herdada do texto

### Resultado
Ícones minimalistas, monocromáticos, alinhados com a identidade editorial do site.

