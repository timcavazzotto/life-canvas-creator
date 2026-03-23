

## Plano: Preenchimento sequencial sem labels de mês

### O que muda
Remover os labels de mês do topo do grid. O preenchimento de semanas vividas passa a ser puramente sequencial: calcula o total de semanas vividas desde a data de nascimento e preenche da esquerda pra direita, de cima pra baixo, sem alinhamento mensal.

### Alterações

**1. `src/components/PosterPreview.tsx`**
- Remover o bloco `monthLabels` (useMemo que calcula labels de mês)
- Remover a `<div className="month-row">` e seus filhos do JSX
- Manter o cálculo de `lived` como está (já usa data completa)
- Manter `yearRows` como está (já preenche sequencialmente: `idx < lived`)

**2. `src/data/posterData.ts`**
- Manter `MONTHS` e `WEEK_POS` exports (podem ser usados em outros lugares), mas não são mais referenciados no poster

### Resultado
- Grid limpo, sem linha de meses no topo
- Preenchimento correto baseado na data exata de nascimento
- Visualmente mais simples e sem ambiguidade sobre quando a vida começa

