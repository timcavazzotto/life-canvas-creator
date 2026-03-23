

## Plano: Adicionar seletor de ano/mês no date picker

### Problema
O calendário atual só navega mês a mês com setas, tornando impraticável chegar a anos como 1940 ou 1976.

### Solução
Adicionar `captionLayout="dropdown-buttons"` de volta ao `<Calendar>`, mas desta vez **remover** o campo separado de ano que existia antes (que causava a duplicação). A prop `fromYear` e `toYear` já estão configuradas — o dropdown nativo do react-day-picker exibirá selects de mês e ano diretamente no header do calendário.

### Arquivo alterado
- `src/pages/Index.tsx` — adicionar `captionLayout="dropdown-buttons"` no `<Calendar>` (linha ~260)

### Resultado
Dropdowns de mês e ano integrados no header do calendário, sem campos duplicados.

