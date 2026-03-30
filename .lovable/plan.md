

## Plano: Simplificar painel Casal — grid padrão com marcador de casamento

### Resumo
Eliminar o `CoupleGrid` (grid em Y) e usar o grid padrão para o painel "casal". A diferença será apenas um marcador visual na semana do casamento (cor diferente). Remover campo de nascimento do cônjuge, manter nome do cônjuge e data de casamento.

### Mudanças

**`src/data/panelTypes.ts`**
- Mudar `gridMode` de `'couple'` para `'standard'`
- Remover `'partnerBirth'` do `extraFields` → ficando `['partnerName', 'marriageDate']`

**`src/data/posterData.ts`**
- Remover `partnerBirth` do `PosterState` interface

**`src/pages/Index.tsx`**
- Remover o bloco do campo "Nascimento do cônjuge" (linhas 343-356)
- Manter campos "Nome do cônjuge" e "Data do casamento"

**`src/components/PosterPreview.tsx`**
- Remover import e uso do `CoupleGrid`
- Remover a segunda `pf-row` com dados do cônjuge (nascimento cônjuge) — simplificar para mostrar apenas nome do cônjuge e data do casamento na ficha
- No grid padrão (`yearRows`), calcular a semana do casamento relativa ao nascimento e marcar essa célula com classe `marriage` em vez de `lived`/`future`
- Adicionar item na legenda para o marcador de casamento (ex: quadrado com cor de destaque + "Casamento")

**`src/App.css`**
- Adicionar estilo `.wk.marriage` com cor de destaque (ex: um tom rosado/dourado que contraste com lived e future)

**`src/components/CoupleGrid.tsx`**
- Pode ser deletado (não será mais usado)

### Detalhes técnicos

Cálculo do marcador de casamento no grid:
```typescript
const marriageWeekIdx = (st.birth && st.marriageDate) 
  ? Math.floor((parse(marriageDate) - parse(birth)) / 6048e5)
  : null;

// No yearRows, se idx === marriageWeekIdx → classe 'marriage'
```

