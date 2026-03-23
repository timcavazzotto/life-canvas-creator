
## Plano: corrigir de forma definitiva o header do PDF e remover o esticamento lateral

### Diagnóstico
O problema agora está em 2 pontos diferentes:

1. **Título mais baixo no PDF**
   - Hoje o header usa `.ph { align-items: center }` e `.ph-right { justify-content: center }`.
   - Isso centraliza o bloco direito pela **altura total** do lado esquerdo (eyebrow + título + subtítulo), então a frase motivacional não acompanha a linha real do título.
   - Resultado: no PDF o título parece mais baixo, mesmo quando a prévia parece “quase certa”.

2. **Poster esticado lateralmente**
   - Em `src/pages/Index.tsx`, o PDF voltou a usar `pdf.addImage(..., 0, 0, pageW, pageH)`.
   - Isso força a imagem a preencher a página inteira, mesmo se o canvas tiver proporção ligeiramente diferente.
   - Resultado: o PDF perde proporção e parece alargado.

### Solução
Parar de alinhar o header “por centro geral” e passar a alinhar a frase motivacional **pela linha do título**.  
Ao mesmo tempo, restaurar a exportação com preservação de proporção, mas corrigindo a origem para evitar bordas.

### O que implementar

#### 1. Reestruturar o header com grid
Em `src/App.css`:
- trocar `.ph` de flex para **CSS Grid**
- usar 2 colunas:
  - esquerda: conteúdo principal
  - direita: bloco da frase
- usar 3 linhas visuais:
  - eyebrow
  - título
  - subtítulo

Exemplo de comportamento:
```text
[ eyebrow   ][          ]
[ título    ][ frase    ]
[ subtítulo ][ autoria  ]
```

Isso resolve a causa principal: a frase passa a começar na altura do título, não no centro do bloco inteiro.

#### 2. Posicionar o bloco direito na linha do título
Em `src/App.css`:
- `.ph-right` deve ocupar a área da direita, começando na **segunda linha** do grid
- remover o `justify-content: center`
- remover compensações herdadas de alinhamento global

Assim o bloco da frase fica ancorado ao título, tanto na tela quanto no PDF.

#### 3. Limpar offsets que atrapalham a leitura óptica
Em `src/App.css`:
- revisar `.ph-title`
- remover dependência de compensações verticais artificiais
- manter no máximo **um ajuste óptico horizontal pequeno** no título, se ainda parecer recuado

Objetivo:
- eyebrow, título e subtítulo com a mesma borda esquerda visual
- sem depender de centralização do container inteiro

#### 4. Corrigir a exportação do PDF sem esticar
Em `src/pages/Index.tsx`:
- remover o preenchimento forçado `pageW, pageH`
- voltar a calcular largura/altura com base na proporção real do canvas
- centralizar apenas se houver diferença mínima

#### 5. Corrigir a origem da proporção do poster
Em `src/App.css`:
- ajustar `.paper-sheet` para usar uma proporção A-series mais precisa
- isso reduz a diferença entre preview/canvas/página e evita o reaparecimento das bordas quando o PDF preservar proporção

### Arquivos a alterar
| Arquivo | Ação |
|---|---|
| `src/App.css` | refatorar o header para grid, alinhar a frase na linha do título, ajustar proporção da folha |
| `src/pages/Index.tsx` | restaurar exportação com preservação de proporção do canvas |

### Resultado esperado
- o título deixa de ficar “mais baixo” no PDF
- a frase motivacional alinha pela mesma faixa vertical do título
- eyebrow, título e subtítulo ficam coerentes lateralmente
- o PDF volta a manter a proporção correta, sem aparência esticada

### Ajuste mais eficiente
Em vez de continuar movendo milímetros no bloco direito ou no título, a correção precisa ser:
1. **estrutural no header**
2. **proporcional no export**

É isso que estabiliza preview e PDF ao mesmo tempo.
