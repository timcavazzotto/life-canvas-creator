

## Plano: Corrigir exportação PDF com html2canvas — foco na proporção

### Diagnóstico

O código atual já usa `html2canvas` + `jsPDF`. Os dois problemas reais são:

1. **Grid colapsado**: As células `.wk` perderam `aspect-ratio: 1` (linha 212 do CSS), então o grid não renderiza — as células têm altura 0. A página parece "não abrir".

2. **Proporção no PDF**: O `html2canvas` captura o `.poster` (que tem `height: 100%` do `.paper-sheet`), mas o conteúdo interno pode não preencher exatamente a proporção A-series. A solução é garantir que o grid (`.pg`) ocupe todo o espaço restante via flexbox, sem overflow.

### Alterações

#### 1. `src/App.css` — Restaurar `.wk` e garantir flex no grid

- **Restaurar `aspect-ratio: 1`** nas células `.wk` (linha 212) — sem isso o grid colapsa
- Adicionar `overflow: hidden` no `.poster` para que nenhum conteúdo vaze além da área do papel
- O `.pg` já tem `flex: 1` — manter isso para que o grid ocupe o espaço disponível
- Adicionar `overflow: hidden` no `.pg` e `.year-rows` para que linhas em excesso sejam contidas em vez de empurrar o footer para fora

#### 2. `src/pages/Index.tsx` — Ajuste fino da captura

- Capturar `paperEl` (`.paper-sheet`) em vez de `posterEl` (`.poster`), pois o `.paper-sheet` tem as dimensões fixas com `aspect-ratio: 297/420`. Isso garante que a imagem capturada tenha exatamente a proporção A-series, eliminando o problema de proporção no PDF.
- Calcular `scale` a partir de `paperEl.offsetWidth` (800px)
- O PDF recebe a imagem com dimensões exatas em mm

#### 3. Sem mudança de dependências

Manter `html2canvas` e `jspdf` como estão. Não adicionar `dom-to-image-more`.

### Arquivos

| Arquivo | Ação |
|---------|------|
| `src/App.css` | Restaurar `aspect-ratio: 1` em `.wk`, adicionar `overflow: hidden` no poster e grid |
| `src/pages/Index.tsx` | Capturar `paperEl` em vez de `posterEl` |

### Resultado esperado
- Página volta a renderizar o grid
- PDF com proporção A-series exata (sem esticamento, sem bordas extras)
- Footer contido dentro da área do papel
- Header preservado (mesma captura html2canvas, sem mudança)

