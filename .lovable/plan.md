

## Plano: Trocar a estratégia de exportação para `window.print()` com CSS `@media print`

### Por que trocar

O problema fundamental é que `html2canvas` rasteriza o DOM com diferenças sutis de renderização (fontes, espaçamento, grid) em relação ao que o navegador mostra. Nenhum ajuste de CSS resolve isso porque a ferramenta de captura é a fonte da divergência. Já tentamos múltiplas combinações de alinhamento e escala sem sucesso estável.

### Nova estratégia

Usar o motor de renderização do **próprio navegador** para gerar o PDF, via `window.print()`. O navegador renderiza a versão de impressão usando exatamente o mesmo engine que mostra o preview — eliminando 100% das diferenças de fidelidade.

### O que implementar

#### 1. Adicionar CSS `@media print` em `src/App.css`

- Esconder tudo exceto o poster: nav, hero, how, testimonials, pricing, config sidebar, footer — tudo `display: none`
- O `.paper-sheet` perde sombra, transform e margem — ocupa a página inteira
- O `.poster` ocupa 100% da largura e altura da página
- Definir `@page` com tamanho dinâmico (A3 por padrão, A2 via classe no body)
- Zerar margens da página: `@page { margin: 0 }`

Exemplo conceitual:
```css
@media print {
  body > *:not(.config-section) { display: none !important; }
  .config-section { display: block !important; }
  .cfg-sidebar, .cfg-preview-hint { display: none !important; }
  .paper-sheet { 
    transform: none !important; 
    width: 100% !important; 
    height: 100% !important;
    box-shadow: none !important; 
    margin: 0 !important; 
  }
  @page { size: A3 portrait; margin: 0; }
}
body.print-a2 @page { size: A2 portrait; }
```

#### 2. Trocar o `downloadPDF` em `src/pages/Index.tsx`

Substituir toda a lógica de `html2canvas` + `jsPDF` por:
1. Adicionar classe `print-a2` ou `print-a3` no `<body>` conforme `st.paperSize`
2. Chamar `window.print()`
3. Remover a classe após impressão

Isso elimina `html2canvas` e `jsPDF` da equação. O usuário usa o diálogo nativo "Salvar como PDF" do navegador.

#### 3. Manter o header como está

O grid atual do header (3 linhas, 2 colunas) está estruturalmente correto. O problema de alinhamento era causado pelo `html2canvas`, não pelo CSS. Com `window.print()`, o que aparece no preview é exatamente o que sai no PDF.

### Limitação e mitigação

O usuário verá o diálogo de impressão do navegador em vez de um download automático. Para mitigar:
- Mostrar um toast explicando: "Use 'Salvar como PDF' no diálogo de impressão"
- Garantir que as configurações de `@page` já definem o tamanho correto

### Arquivos a alterar

| Arquivo | Ação |
|---|---|
| `src/App.css` | Adicionar bloco `@media print` completo |
| `src/pages/Index.tsx` | Substituir `downloadPDF` por `window.print()` |

### Resultado esperado
- O PDF é idêntico ao preview — mesma engine de renderização
- Sem esticamento, sem bordas brancas, sem corte
- Header perfeitamente alinhado
- Tamanho A2 ou A3 conforme seleção
- Código muito mais simples e sem dependências frágeis

