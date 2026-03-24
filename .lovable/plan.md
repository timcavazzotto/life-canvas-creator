

## Plano: Corrigir visibilidade de "Uma marca Studio Mets" no footer

### Problema
O footer usa `display: flex; justify-content: space-between` em layout horizontal. O terceiro elemento fica posicionado ao lado dos outros dois, mas com `text-xs` e `opacity-60` pode estar invisível ou fora da área visível. Além disso, as classes Tailwind podem conflitar com o CSS customizado.

### Solução
Usar CSS inline em vez de classes Tailwind e ajustar o layout do footer para acomodar 3 linhas empilhadas com `flex-wrap: wrap`.

### Mudanças

**`src/pages/Index.tsx`** (linha 418):
- Trocar classes Tailwind por estilo inline com cor e tamanho explícitos
- Adicionar `width: 100%` e `text-align: center` para garantir que apareça como linha separada

```tsx
<div style={{ width: '100%', textAlign: 'center', fontSize: '11px', color: 'rgba(240,236,224,0.4)', marginTop: '8px' }}>
  Uma marca Studio Mets
</div>
```

**`src/App.css`** (linha 222):
- Adicionar `flex-wrap: wrap` ao `.site-footer` para permitir que o terceiro item quebre para nova linha

