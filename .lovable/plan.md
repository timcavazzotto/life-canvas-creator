

## Plano: Trocar ano de nascimento por data completa

### Problema
Hoje o campo `birth` armazena apenas o ano (ex: 1976), e o cálculo assume 1 de janeiro. Isso gera imprecisão — alguém nascido em dezembro de 1976 aparece com quase 1 ano a mais de semanas vividas. Além disso, para presentes de aniversário, a data exata é importante.

### O que será feito

1. **Alterar `PosterState.birth`** de `number | null` para `string | null` (formato `YYYY-MM-DD`)

2. **Trocar o input** no configurador (`Index.tsx`):
   - Substituir o `<input type="number">` de ano por um date picker (usando Popover + Calendar do shadcn)
   - Exibir a data formatada no poster (dia/mês/ano)

3. **Ajustar o cálculo de semanas vividas** em `PosterPreview.tsx` e `Index.tsx`:
   - Usar a data completa para calcular milissegundos vividos
   - `Math.floor((Date.now() - new Date(birth).getTime()) / 6048e5)`

4. **Atualizar o poster** para exibir a data formatada no campo "Nascimento" (ex: "15/03/1976") em vez de apenas "1976"

5. **Atualizar labels** em `posterData.ts`: "Nascimento" / "Birth date" / "Nacimiento" (já existem, apenas ajustar se necessário)

### Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/data/posterData.ts` | `birth: string \| null` no `PosterState` |
| `src/pages/Index.tsx` | Trocar input de ano por date picker; ajustar cálculo |
| `src/components/PosterPreview.tsx` | Ajustar cálculo de `lived` para usar data completa; formatar exibição |

### Resultado
- Campo de data completa (dia/mês/ano) no configurador
- Cálculo preciso de semanas vividas
- Poster exibe data formatada (ex: "15/03/1976")

