
Objetivo: voltar para PDF, trocar `html2canvas` por `dom-to-image-more`, mas sem repetir os mesmos erros de geometria e corte.

Plano
1. Substituir a estratégia de captura em `src/pages/Index.tsx`
- Remover a exportação atual baseada em `html2canvas`.
- Passar a usar `dom-to-image-more` para gerar uma imagem do poster e embutir essa imagem em um PDF.
- Manter a captura partindo do `.paper-sheet`, não do layout inteiro da página.

2. Corrigir a geometria antes da captura
- Criar um container de exportação isolado, fora da viewport, com proporção A exata.
- Clonar o `.paper-sheet` inteiro nesse container.
- Remover no clone apenas efeitos de preview que atrapalham exportação, como `transform: scale`, sombra e margens negativas.
- Fixar largura/altura reais do artboard para A3 e A2, para evitar esticamento lateral e corte do footer.

3. Preservar fidelidade visual do header
- Esperar as fontes carregarem antes da captura.
- Capturar o clone já no tamanho final, em vez de reconstruir tipografia “na marra”.
- Manter o CSS estrutural atual do header e só revisar se houver alguma regra de preview contaminando o clone.

4. Gerar PDF com tamanho físico correto
- Usar `jsPDF` novamente apenas como contêiner final do arquivo.
- Configurar página A2 ou A3 conforme a seleção.
- Inserir a imagem no PDF com cálculo proporcional rígido, sem `stretch` e sem lógica que force cover/crop.

5. Ajustar a interface para refletir o retorno ao PDF
- Trocar os textos dos botões de download de volta para PDF.
- Atualizar mensagens de feedback para deixar claro que o arquivo gerado é PDF em alta resolução.

6. Limpeza técnica
- Adicionar `dom-to-image-more` no `package.json`.
- Remover `html2canvas` se ele não for mais usado.
- Manter somente a cadeia de exportação final que estiver ativa, para parar a oscilação entre estratégias.

Arquivos envolvidos
- `src/pages/Index.tsx`
- `src/App.css`
- `package.json`

Resultado esperado
- PDF em A2/A3 conforme seleção
- sem bordas brancas externas
- sem esticamento lateral
- sem corte do footer
- header muito mais próximo do preview
- fluxo de exportação mais estável e comercial

Risco principal
- `dom-to-image-more` melhora a captura DOM, mas não resolve sozinho problemas de layout; por isso a parte crítica do plano é isolar e fixar o artboard de exportação antes de gerar o PDF.
