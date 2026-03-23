
## Plano: corrigir de forma definitiva a prévia e o PDF usando uma “folha” real

### Diagnóstico end-to-end
Revendo o fluxo completo, o problema não está só no `jsPDF`. Ele nasce antes:

1. **A prévia não representa uma folha A2/A3**
   - Hoje a `.poster` tem largura fixa (`780px`) e é “encaixada” na tela com `transform: scale(...)`.
   - Isso só reduz visualmente na UI; **não muda a proporção real** do conteúdo.

2. **O PDF não exporta a mesma coisa que a prévia mostra**
   - Em `downloadPDF`, o código remove `transform` antes do `html2canvas`.
   - Ou seja: a tela mostra uma versão escalada, mas o PDF captura outra versão, em tamanho/proporção diferentes.

3. **O elemento exportado é o poster, não a folha**
   - O código captura `posterRef`, que é apenas o painel.
   - Como esse painel é mais alto/estreito que A2/A3, a escala sempre acaba limitada pela altura, sobrando borda lateral branca.

4. **As tentativas anteriores mexeram na escala, mas não no modelo**
   - Enquanto a exportação continuar capturando um elemento com proporção própria, diferente do papel, as bordas laterais vão continuar aparecendo.

### Solução efetiva
Parar de “escalar o poster” e passar a trabalhar com uma **folha real** na prévia e no PDF.

### O que implementar

#### 1. Criar um contêiner de folha com proporção A-series
Em vez de renderizar só `.poster` dentro da prévia, criar um wrapper tipo:
- `.paper-sheet`
- proporção fixa de papel (`aspect-ratio: 297 / 420`)
- tamanho responsivo na tela
- centralizado no preview

Como A2 e A3 têm a mesma proporção, a prévia pode usar a mesma base visual e apenas mudar o rótulo/tamanho de exportação.

#### 2. Fazer o poster preencher a folha, não a viewport
A `.poster` deve deixar de usar:
- `width: 780px`
- `transform: scale(...)`
- `margin-bottom` negativo

E passar a usar:
- `width: 100%`
- `height: 100%`
- padding interno proporcional à folha

Assim, a prévia finalmente passa a mostrar o layout real do PDF.

#### 3. Ajustar o grid para caber na altura útil da folha
Hoje o grid define demais a altura total por causa das células quadradas.
Para o poster caber corretamente em A2/A3:
- o grid precisa ser dimensionado pela **área disponível da folha**
- as células devem usar altura controlada pelo layout da folha, não por `aspect-ratio: 1`

Implementação esperada:
- remover dependência de célula quadrada rígida no modo de impressão/preview final
- definir altura do grid por CSS/layout
- deixar as células levemente retangulares se necessário para fechar a proporção corretamente

Isso resolve a causa estrutural do problema.

#### 4. Exportar a folha inteira, não só o poster
Trocar o alvo do `html2canvas`:
- de `posterRef`
- para um novo `paperRef` (wrapper da folha)

No PDF:
- capturar a folha completa
- adicionar a imagem ocupando a página inteira (`0,0,pageW,pageH`) ou com margem mínima fixa embutida no próprio layout

Resultado:
- sem bordas laterais inesperadas
- PDF igual à prévia

#### 5. Separar claramente “layout de tela” e “layout de exportação”
Se necessário:
- `PosterPreview` recebe uma prop como `mode="preview" | "export"`
- ou usa classes específicas no wrapper

Mas o ideal é que preview e PDF usem o mesmo artboard, mudando só resolução, não estrutura.

### Arquivos a alterar
| Arquivo | Ação |
|---|---|
| `src/pages/Index.tsx` | criar wrapper de folha (`paperRef`) e exportar esse elemento |
| `src/App.css` | substituir escala por layout responsivo baseado em folha A-series |
| `src/components/PosterPreview.tsx` | adaptar o poster para preencher a folha e não depender de largura fixa |

### Resultado esperado
- A prévia passa a caber corretamente no PC e no mobile
- A prévia passa a representar a folha real
- O PDF fica igual ao que o usuário vê
- As bordas laterais brancas deixam de aparecer por causa da proporção errada
- Não dependemos mais de hacks de escala, `transform`, ou compensações com margem negativa

### Detalhe técnico
A correção definitiva não é “mais um ajuste no `ratio` do PDF”.  
É trocar o modelo de renderização de:

```text
poster fixo -> escala visual na tela -> captura do poster
```

para:

```text
folha A-series real -> poster desenhado dentro da folha -> captura da folha inteira
```

Esse é o ponto central que está faltando hoje.
