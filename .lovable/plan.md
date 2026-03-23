

## Plano: Corrigir duplicação de data no calendário

### Problema
Quando `captionLayout="dropdown-buttons"` está ativo, o `react-day-picker` renderiza **tanto** os dropdowns de mês/ano **quanto** o label de texto padrão do caption (ex: "March 2026" em inglês). Resultado: duas indicações de data, uma em inglês e uma em português.

### Solução
Esconder o `caption_label` no componente `Calendar` quando dropdowns estão presentes, adicionando `hidden` à classe.

### Arquivo alterado
- `src/components/ui/calendar.tsx` — alterar a classe `caption_label` de `"text-sm font-medium"` para `"text-sm font-medium hidden"`

Isso remove o texto duplicado e mantém apenas os dropdowns localizados.

