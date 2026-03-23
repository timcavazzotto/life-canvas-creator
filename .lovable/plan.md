

## Plano: Label "ainda por viver" dinâmico por tom

### Ideia
Em vez de um label fixo, o texto do rodapé ("Ainda por viver") muda conforme o tom selecionado, alinhando com a filosofia de cada um.

### Textos propostos por tom

| Tom | PT | EN | ES |
|-----|----|----|-----|
| Filosófico | Por conquistar | Yet to conquer | Por conquistar |
| Otimista | Por celebrar | To celebrate | Por celebrar |
| Científico | Por registrar | To record | Por registrar |
| Espiritual | Por honrar | To honor | Por honrar |

### Alterações

**1. `src/data/posterData.ts`**
- Adicionar campo `ainda` ao objeto `TONES` (dentro de cada tom), com as 3 línguas
- Remover `ainda` do `LABELS` fixo

**2. `src/components/PosterPreview.tsx`**
- No rodapé, trocar `lb.ainda` por `t.ainda[l]` (onde `t` já é `TONES[st.tone]`)

### Arquivos
| Arquivo | Ação |
|---------|------|
| `src/data/posterData.ts` | Adicionar `ainda` em cada tom de `TONES`; remover de `LABELS` |
| `src/components/PosterPreview.tsx` | Usar `t.ainda[l]` no rodapé |

