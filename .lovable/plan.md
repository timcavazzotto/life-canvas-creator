

## Plano: Alinhar verticalmente título e frase motivacional no header

### Problema
O `.ph-right` usa `justify-content: flex-start` com `padding-top: 0`, fazendo a quote colar no topo absoluto do container. Enquanto isso, o título no bloco esquerdo fica abaixo do eyebrow (8px + gap 6px), criando um desnivelamento — a quote começa mais alta que o título.

No preview isso é sutil, mas no PDF (rasterizado) fica evidente.

### Solução
Centralizar verticalmente o bloco direito em relação ao bloco esquerdo. O bloco esquerdo tem ~60px de altura total (eyebrow 8px + gap 6px + título 42px + gap 6px + subtitle 8px). A quote centralizada ficará alinhada visualmente com o título.

### Alterações em `src/App.css`

| Seletor | De | Para |
|---------|-----|------|
| `.ph` (L181) | `align-items: flex-start` | `align-items: center` |
| `.ph-right` (L187) | `justify-content: flex-start; padding-top: 0` | `justify-content: center` |

Apenas 2 propriedades alteradas. O `align-items: center` no `.ph` alinha ambos os blocos pelo centro vertical. O `justify-content: center` no `.ph-right` centraliza a quote+attr dentro do seu próprio bloco.

### Arquivo alterado
| Arquivo | Ação |
|---------|------|
| `src/App.css` | Centralizar verticalmente ambos os blocos do header |

