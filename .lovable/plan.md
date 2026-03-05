

## Plano: Reordenar "Tom das frases" e colapsar Dedicatória

### Mudanças em `src/pages/Index.tsx`

**1. Mover "Tom das frases"** — Tirar a seção Tone da posição atual (após Color, linha 311-329) e colocá-la logo após a seção Identity (após linha 258), antes de Stats. Assim o usuário vê o efeito no pôster imediatamente.

**2. Dedicatória colapsável** — Transformar o campo de dedicatória (linhas 254-257) num mini-bloco colapsável dentro de Identity:
- Adicionar estado `dedicOpen` (default `false`)
- Renderizar um botão/link "Dedicatória (opcional) ▾" que ao clicar expande o textarea
- Quando colapsado, o textarea fica oculto

### Ordem final das seções na sidebar
1. Identidade (nome, nascimento, expectativa, dedicatória colapsável)
2. **Tom das frases** ← movido para cá
3. Sua vida em números
4. Paleta
5. Idioma

