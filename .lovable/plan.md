

## Plano: Semanas pós-casamento com cor + Novo painel "Corrida"

### 1. Semanas após casamento com cor diferente

**Problema atual**: Apenas a semana exata do casamento recebe a classe `marriage`. O usuário quer que todas as semanas após o casamento (que já foram vividas) tenham essa cor, representando "vida a dois".

**Mudança em `src/components/PosterPreview.tsx`** (yearRows, ~linha 56-63):
- Lógica atual: `idx === marriageWeekIdx` → `'marriage'`
- Nova lógica: `idx >= marriageWeekIdx && idx < lived` → `'marriage'` (semanas vividas após casamento ganham cor de casamento)
- Semanas antes do casamento e já vividas continuam como `'lived'`
- Semanas futuras (após today) continuam como `'future'`

**Legenda** (~linha 140): trocar texto "Casamento" por "Vida a dois" / "Life together" / "Vida en pareja" (usar `lb.together` que já existe nos labels do painel casal).

### 2. Novo painel "Corrida"

**`src/data/panelTypes.ts`** — adicionar novo painel ao array `PANEL_TYPES`:
- `id: 'corrida'`, `label: 'Corrida de Rua'`, `icon: 'timer'` (ícone de cronômetro)
- `gridMode: 'standard'`
- 4 tons temáticos:
  - **Competidor**: foco em provas, superação, recordes pessoais
  - **Consistente**: foco em km semanais, disciplina, rotina
  - **Comunidade**: foco em grupos de corrida, amizades, pelotão
  - **Transformação**: foco na mudança de vida, saúde, autoestima (especialmente relevante para o público feminino crescente)
- Labels específicos: "Semanas de treino", "Por correr", etc.

**`src/components/PosterPreview.tsx`** — adicionar entrada no `alMap`:
- `corrida: { pt: 'uma vida em movimento', en: 'a life on the run', es: 'una vida en carrera' }`

### Arquivos modificados
| Arquivo | Mudança |
|---|---|
| `src/components/PosterPreview.tsx` | Semanas pós-casamento com classe `marriage` + entrada `corrida` no alMap |
| `src/data/panelTypes.ts` | Novo painel "corrida" com 4 tons e labels em 3 idiomas |

