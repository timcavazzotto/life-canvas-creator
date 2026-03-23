

## Plano: Corrigir exportação PDF via `window.print()` e garantir resolução para impressão A2/A3

### Problema raiz identificado
O CSS atual tem **sintaxe inválida** para as regras `@page`:

```css
/* INVÁLIDO — browser ignora completamente */
body.print-a3 @page { size: A3 portrait; }
body.print-a2 @page { size: A2 portrait; }
```

A spec CSS não permite `@page` aninhado dentro de um seletor. O resultado: o browser ignora o tamanho da página e usa o padrão (Letter/A4), causando corte, bordas e proporção errada.

### Solução

Usar **JavaScript para injetar dinamicamente** a regra `@page` correta antes de chamar `window.print()`, e removê-la depois.

### Alterações

#### 1. `src/pages/Index.tsx` — injetar `@page` via JS

Substituir o `downloadPDF` atual por:
```typescript
const downloadPDF = useCallback(() => {
  import('sonner').then(({ toast }) => {
    // Inject @page rule dynamically
    const size = st.paperSize === 'a2' ? 'A2' : 'A3';
    const style = document.createElement('style');
    style.id = 'print-page-size';
    style.textContent = `@page { size: ${size} portrait; margin: 0; }`;
    document.head.appendChild(style);
    
    document.body.classList.add('printing');
    
    toast('Use "Salvar como PDF" no diálogo de impressão', { duration: 5000 });
    
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing');
      style.remove();
    }, 200);
  });
}, [st.paperSize]);
```

#### 2. `src/App.css` — simplificar `@media print`

- Remover as regras `@page` inválidas (linhas 354-396)
- Manter apenas o bloco `@media print` com:
  - `@page { margin: 0; }` como fallback
  - Esconder tudo exceto o poster
  - `.paper-sheet` e `.poster` preenchem 100% da página
- Remover as regras `body.print-a3 @page` e `body.print-a2 @page` (inválidas)
- Usar classe `.printing` em vez de `print-a2`/`print-a3`

#### 3. Resolução para impressão de parede

Com `window.print()`, a renderização usa a resolução nativa do browser (tipicamente 300 DPI para "Salvar como PDF"). Para A2 (420×594mm) a 300 DPI isso dá ~4960×7016 pixels — resolução adequada para impressão de parede.

O poster já usa vetores (texto, bordas CSS) que escalam infinitamente. Apenas o grid de quadrados precisa renderizar bem, e com CSS puro isso é vetorial.

### Arquivos a alterar
| Arquivo | Ação |
|---------|------|
| `src/App.css` | Corrigir `@media print`, remover `@page` inválidos |
| `src/pages/Index.tsx` | Injetar `@page` dinâmico via JS |

### Resultado esperado
- PDF em A2 ou A3 conforme seleção real
- Sem bordas brancas, sem esticamento, sem corte
- Resolução vetorial adequada para impressão de parede
- Header idêntico ao preview (mesmo engine de renderização)

