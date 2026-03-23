

## Plano: Restaurar células quadradas no grid

### Problema
Quando migramos para o modelo de "folha real", o `.year-rows` recebeu `flex: 1` para preencher o espaço vertical da folha. Isso estica as linhas do grid verticalmente, e como `.wk` não tem mais `aspect-ratio: 1`, as células ficam achatadas (retangulares).

### Solução
Adicionar `aspect-ratio: 1` de volta às células `.wk` para garantir que sejam quadradas. Remover `flex: 1` do `.year-rows` para que o grid não seja esticado — ele terá sua altura natural baseada nas células quadradas.

### Alterações em `src/App.css`

1. **`.year-rows`** (linha 201): remover `flex: 1`
2. **`.wk`** (linha 204): adicionar `aspect-ratio: 1`
3. **`.pg`** (linha 194): remover `flex: 1` — o grid não deve esticar para preencher a folha

O grid terá seu tamanho natural. O espaço restante na folha ficará como margem inferior, o que é visualmente aceitável e mantém a proporção correta.

### Arquivos
| Arquivo | Ação |
|---------|------|
| `src/App.css` | Restaurar `aspect-ratio: 1` em `.wk`, remover `flex: 1` de `.year-rows` e `.pg` |

