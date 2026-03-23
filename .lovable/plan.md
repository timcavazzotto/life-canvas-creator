
## Plano: refatorar o header do poster para alinhamento consistente no preview e no PDF

### Diagnóstico ponto a ponto
O desalinhamento atual não é um único valor errado; ele vem da soma de vários ajustes isolados:

1. **O lado esquerdo não tem um container próprio**
   - Em `PosterPreview.tsx`, eyebrow, título e subtítulo estão dentro de um `<div>` genérico.
   - Isso dificulta controlar alinhamento horizontal/vertical como um bloco único.

2. **O lado direito tem espaçamento “solto” fora do CSS principal**
   - A frase motivacional usa `className="ph-quote my-[13px]"`.
   - Esse `my-[13px]` adiciona margens verticais via Tailwind e foge do sistema de espaçamento do header.

3. **O header mistura vários mecanismos de espaçamento**
   - `.ph-eyebrow` usa `margin-bottom`
   - `.ph-title` usa `padding-bottom`
   - `.ph-subtitle` usa `margin-top`
   - `.ph-right` usa `padding-top`
   - Isso gera um layout difícil de calibrar e mais sensível no PDF.

4. **O “alinhamento lateral” do título hoje é mais óptico que estrutural**
   - Mesmo começando no mesmo container, o título parece mais “para dentro” por causa da tipografia grande, `letter-spacing`, peso leve e do `+` inline.
   - Tentar corrigir isso com margens soltas no próprio título não escala bem.

5. **O PDF só evidencia o problema**
   - Como preview e export usam o mesmo DOM, a solução correta é estabilizar o layout do header na origem, não compensar no export.

### Solução eficiente
Trocar o header de um conjunto de ajustes manuais para uma **estrutura em dois blocos controlados**, com alinhamento e espaçamento definidos por layout, não por hacks.

### O que implementar

#### 1. Estruturar o header em dois blocos explícitos
Em `src/components/PosterPreview.tsx`:
- criar um wrapper esquerdo, por exemplo `.ph-left`
- manter `.ph-right` como bloco direito
- remover a classe Tailwind `my-[13px]` da frase motivacional

Estrutura esperada:
```text
.ph
├── .ph-left
│   ├── .ph-eyebrow
│   ├── .ph-title
│   └── .ph-subtitle
└── .ph-right
    ├── .ph-quote
    └── .ph-attr
```

#### 2. Reescrever o alinhamento do header com grid/flex limpo
Em `src/App.css`:
- transformar `.ph` em um layout de duas colunas estável
- usar algo como:
  - coluna esquerda flexível
  - coluna direita com largura fixa já compatível com o layout (`260px`)
- alinhar ambos pelo topo, sem `padding-top` compensatório

Objetivo:
- o bloco esquerdo e o direito passam a ter o mesmo ponto de partida vertical
- preview e PDF ficam com a mesma leitura visual

#### 3. Unificar o espaçamento vertical do bloco esquerdo
Em vez de margins/paddings espalhados:
- `.ph-left` passa a usar `display: flex`, `flex-direction: column`
- o espaçamento entre eyebrow, título e subtítulo passa a ser controlado por `gap`

Isso permite:
- subir/descer o título de forma previsível
- ajustar a distância título/subtítulo sem quebrar o alinhamento geral

#### 4. Resetar margens “acidentais” dos elementos do header
Em `src/App.css`:
- zerar margens/paddings que hoje interferem no alinhamento:
  - `.ph-eyebrow`
  - `.ph-title`
  - `.ph-subtitle`
  - `.ph-quote`
  - `.ph-attr`
  - `.ph-right`

Depois disso, o layout passa a depender só do container:
- `.ph-left` controla o bloco esquerdo
- `.ph-right` controla o bloco direito
- `.ph` controla a relação entre ambos

#### 5. Fazer o ajuste óptico final em um único ponto
Depois da limpeza estrutural, aplicar no máximo **um** ajuste óptico:
- ou no bloco esquerdo (`.ph-left`)
- ou no título (`.ph-title`)

Mas apenas após remover todos os offsets anteriores.

Isso resolve os dois sintomas:
- título aparentemente “baixo” em relação à frase motivacional
- título aparentemente mais “para dentro” que eyebrow/subtítulo

#### 6. Ajustar o alinhamento lateral real do título
Se, após a refatoração, a fonte continuar parecendo recuada:
- aplicar um microajuste controlado no título, como leve `translateX`/`left`
- manter eyebrow e subtitle sem hacks
- ajustar só o título, porque o problema é óptico da tipografia, não estrutural do bloco

A diferença é que esse ajuste passa a ser:
- pequeno
- isolado
- previsível
- fácil de validar no preview e no PDF

### Arquivos a alterar
| Arquivo | Ação |
|---|---|
| `src/components/PosterPreview.tsx` | criar `.ph-left` e remover `my-[13px]` da quote |
| `src/App.css` | refatorar o header para layout limpo com espaçamento por bloco |

### Resultado esperado
- eyebrow, título e subtítulo ficam visualmente alinhados na mesma borda esquerda
- o título sobe para uma posição coerente em relação à frase motivacional
- o header deixa de depender de margens negativas e compensações frágeis
- o preview e o PDF passam a refletir o mesmo alinhamento com estabilidade

### Critério de validação
Depois da implementação, conferir especificamente:
1. borda esquerda de eyebrow, título e subtítulo
2. altura visual do título em relação à quote
3. distância interna entre eyebrow → título → subtítulo
4. consistência entre preview da tela e PDF exportado

Essa é a forma mais eficiente porque corrige a **estrutura do header**, em vez de continuar somando microajustes isolados.
