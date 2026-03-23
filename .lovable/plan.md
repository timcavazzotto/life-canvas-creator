
Plano: estabilizar o poster para que preview e PDF usem a mesma geometria e o header tenha alinhamento estrutural

Diagnóstico da varredura
- O problema não é um “ajuste fino” isolado: hoje o layout do header ainda depende de compensações visuais (`padding-top: 14px` no bloco direito e tipografia grande no título), então o navegador e o raster do PDF não leem esse alinhamento da mesma forma.
- O PDF também oscila entre 3 comportamentos ruins: preencher tudo, preservar proporção com borda, ou cobrir com corte. Isso acontece porque a captura não parte de uma área de exportação rigidamente controlada.
- A seleção A2/A3 hoje muda a página do PDF, mas não define uma malha de exportação própria; isso facilita diferença visual entre preview e arquivo final.

O que vou implementar
1. Separar “preview visual” de “área real de exportação”
- Em `src/pages/Index.tsx`, manter a moldura de preview só para tela.
- Capturar no PDF apenas a área interna do poster, sem depender do wrapper escalado/sombreado.
- Isso elimina a diferença entre o que é styling de preview e o que realmente vira PDF.

2. Tornar o tamanho do artboard determinístico para A2 e A3
- Em `src/App.css` e `src/pages/Index.tsx`, definir uma área de poster com proporção A-series exata e dimensões controladas.
- A2 e A3 continuarão com o mesmo layout visual, mas a exportação passará a usar geometria/resolução coerentes com a seleção.
- Com isso, o `addImage` poderá preencher a página sem esticar lateralmente, sem borda branca e sem corte.

3. Refatorar o header para alinhamento estrutural
- Em `src/App.css`, substituir compensações atuais do header por um grid explícito:
```text
[ eyebrow   ][          ]
[ título    ][ frase    ]
[ subtítulo ][ autoria  ]
```
- A frase motivacional ficará ancorada na linha do título, não “aproximada” por padding.
- Remover hacks de alinhamento vertical/horizontal do bloco direito.

4. Limpar a tipografia do título
- Em `src/components/PosterPreview.tsx`, isolar melhor o `+` do título para não distorcer o alinhamento óptico.
- Em `src/App.css`, zerar margens implícitas e controlar tudo por `gap`, `line-height` e um único microajuste óptico, se ainda necessário.
- Objetivo: eyebrow, título e subtítulo compartilharem a mesma borda esquerda visual.

5. Recalibrar a exportação para ficar igual ao preview
- Em `src/pages/Index.tsx`, parar de alternar entre lógica de “contain” e “cover”.
- A exportação passará a usar uma origem com proporção já correta; por isso o PDF poderá ocupar a folha inteira com fidelidade.
- Também vou amarrar a captura a um tamanho fixo antes do `html2canvas`, para reduzir diferença de renderização.

Arquivos envolvidos
- `src/pages/Index.tsx`
- `src/App.css`
- `src/components/PosterPreview.tsx`

Resultado esperado
- PDF realmente em A2 ou A3 conforme seleção
- sem esticamento lateral
- sem borda branca externa
- sem corte
- header com título, subtítulo e frase motivacional alinhados de forma consistente
- preview e PDF visualmente muito mais próximos

Critério de validação
- gerar A3 e A2
- comparar preview vs PDF
- conferir:
  - bordas externas
  - proporção do poster
  - alinhamento do título com a frase
  - alinhamento lateral entre eyebrow, título e subtítulo
