

## Plano: Seletor de formato de papel (A2/A3) para exportação PDF

### Problema
O PDF atual usa formato A3 fixo com margem de 10mm, deixando bordas externas largas. O poster não ocupa a folha inteira.

### Solução
Adicionar um select de formato de papel (A2 / A3) no configurador, e ajustar a exportação para:
- Usar o formato selecionado
- Reduzir a margem de 10mm para 5mm (ou 0 para sangria total)
- O poster será escalado para preencher melhor a área útil da folha

### Alterações

**1. `src/data/posterData.ts`**
- Adicionar `paperSize: 'a2' | 'a3'` ao `PosterState` (default: `'a3'`)

**2. `src/pages/Index.tsx`**
- Adicionar estado `paperSize` no `PosterState` inicial
- Adicionar select de formato (A2 / A3) na seção de configuração, próximo ao botão de download
- Alterar `downloadPDF`: usar `st.paperSize` como formato do jsPDF, reduzir margem para 3mm

### Detalhes técnicos
- A2 = 420x594mm, A3 = 297x420mm (jsPDF aceita `'a2'` e `'a3'` diretamente)
- Margem reduzida de 10mm para 3mm para melhor aproveitamento da folha
- O `ratio` de escala já se ajusta automaticamente ao tamanho da página

### Arquivos alterados
| Arquivo | Ação |
|---------|------|
| `src/data/posterData.ts` | Adicionar `paperSize` ao `PosterState` |
| `src/pages/Index.tsx` | Adicionar select de formato + usar no `downloadPDF` |

