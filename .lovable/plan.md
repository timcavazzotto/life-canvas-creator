

## Plano: Ajustar seletor de painéis e grid do casal

### 1. Seletor de painéis — design discreto

**Problema**: Os cards com emojis grandes e grid de swatches estão fora do padrão visual do site.

**Solução**: Trocar por uma lista de botões compactos (estilo pill/tag), com o emoji pequeno ao lado do texto. Layout horizontal com wrap, similar aos seletores de tom/tema já existentes.

**Arquivo**: `src/pages/Index.tsx` (linhas ~236-258)
- Substituir o grid de `cfg-swatches` por botões inline tipo `<button>` com classe simples
- Emoji em tamanho pequeno (0.85rem) ao lado do label
- Botão ativo recebe borda/destaque sutil
- Remover a descrição embaixo (ou mostrar só ao hover/seleção)

### 2. Grid do casal — separação vertical (formato Y)

**Problema**: Atualmente os dois grids estão empilhados horizontalmente (um em cima do outro por ano). O visual correto é lado a lado verticalmente antes do casamento, fundindo num grid único depois.

**Solução**: Reescrever `CoupleGrid.tsx` com layout em Y:
- **Antes do casamento**: Dois grids lado a lado (coluna esquerda = Pessoa 1, coluna direita = Pessoa 2), cada um com ~26 colunas de semanas
- **Marcador de casamento**: Linha horizontal com 💍
- **Após o casamento**: Um grid único centralizado com 52 colunas (formato normal)
- Isso cria visualmente a forma de um Y — dois caminhos que convergem

**Arquivo**: `src/components/CoupleGrid.tsx`
- Pré-casamento: `display: flex` com dois blocos de `.year-rows` lado a lado, cada bloco com 26 colunas (metade das semanas)
- Pós-casamento: bloco único com 52 colunas, largura total
- Ajustar CSS para que a transição visual entre as duas seções seja suave

### Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `src/pages/Index.tsx` | Seletor de painéis compacto com botões pill |
| `src/components/CoupleGrid.tsx` | Layout vertical em Y (lado a lado → fusão) |

