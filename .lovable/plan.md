

## Plano: Corrigir alinhamento do header e bordas brancas no PDF

### Problemas visíveis no PDF

1. **Bordas brancas laterais**: O código de posicionamento no PDF calcula a proporção do canvas e centraliza a imagem se não bater exatamente com a página. Como a `.paper-sheet` já tem `aspect-ratio: 1/1.4142` (igual ao papel A-series), basta preencher a página inteira com `addImage(0, 0, pageW, pageH)` — sem cálculo de ratio.

2. **Subtítulo cortado/sobreposto**: O subtítulo ("4.160 semanas · 80 anos · uma vida ativa") fica parcialmente escondido atrás do título porque o `gap: 4px` no `.ph-left` é pequeno demais para a fonte de 42px do título. O `line-height: 1` do título não deixa espaço natural abaixo dele.

3. **Título visualmente mais baixo que a frase motivacional**: O `.ph-right` usa `justify-content: center` + `align-self: stretch`, centralizando a quote no eixo vertical total do bloco esquerdo. Como o eyebrow é pequeno (8px), o centro visual fica abaixo do título. Solução: alinhar o `.ph-right` pelo topo (`flex-start`) em vez de centralizar.

### Alterações

**`src/App.css`**

| Seletor | De | Para |
|---------|-----|------|
| `.ph-left` (L182) | `gap: 4px` | `gap: 6px` |
| `.ph-title` (L184) | `line-height: 1` | `line-height: 1; padding-bottom: 2px` |
| `.ph-right` (L187) | `justify-content: center` | `justify-content: flex-start; padding-top: 0` |

**`src/pages/Index.tsx`** (linhas 46-54)

Substituir o cálculo de ratio por preenchimento direto:
```typescript
pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH);
```
Remover as variáveis `canvasRatio`, `pageRatio`, `w`, `h`, `x`, `y`.

### Resultado
- PDF preenche a página sem bordas brancas
- Subtítulo visível com espaçamento adequado abaixo do título
- Frase motivacional alinha pelo topo com o eyebrow, na mesma altura visual que o título

### Arquivos alterados
| Arquivo | Ação |
|---------|------|
| `src/App.css` | Ajustar gap, padding do título, alinhamento do bloco direito |
| `src/pages/Index.tsx` | Simplificar addImage para preencher página inteira |

