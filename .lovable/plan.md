

## Plano: Corrigir footer

### Problema
O footer tem layout `flex` horizontal com `justify-content: space-between`, causando cada elemento em posição diferente. A fonte de "Uma marca Studio Mets" usa inline styles enquanto os outros usam classes CSS com fontes/tamanhos diferentes. Resultado: visual desorganizado.

### Solução
Reorganizar o footer para layout vertical centralizado e consistente:

**`src/pages/Index.tsx`** (linhas 415-419):
```tsx
<footer className="site-footer">
  <div className="footer-brand">PROJETO 80<span style={{ fontSize: '0.7em' }}>+</span></div>
  <div className="footer-text">Mova-se enquanto há tempo · © 2025</div>
  <div className="footer-text" style={{ opacity: 0.6 }}>Uma marca Studio Mets</div>
</footer>
```

**`src/App.css`** (linha 222):
Alterar `.site-footer` para sempre usar layout vertical centralizado:
```css
.site-footer { padding: 48px; background: #1a1815; border-top: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; gap: 8px; }
```

Remover `flex-direction: column` duplicado do media query mobile (linha 395) já que agora é padrão.

### Arquivos
- `src/pages/Index.tsx`
- `src/App.css`

