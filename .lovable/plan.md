

## Plano: Exportar PNG em alta resolução (solução comercial definitiva)

### Por que mudar para PNG

Após múltiplas tentativas com `window.print()` e `html2canvas`+`jsPDF`, ficou claro que:
- `window.print()` não controla bem o layout (2 páginas, esticamento)
- `html2canvas`+`jsPDF` introduz diferenças de renderização no header

PNG em alta resolução é a solução mais confiável para um produto comercial de impressão:
- Gráficas aceitam PNG em 300 DPI sem problemas
- O `html2canvas` captura exatamente o que está na tela
- Sem conversão intermediária para PDF (que distorce)
- Resolução controlável com precisão

### Como funciona

A3 a 300 DPI = 3508 x 4961 pixels
A2 a 300 DPI = 4961 x 7016 pixels

O truque: em vez de capturar o preview escalado (que tem ~800px de largura), vamos:
1. Clonar o poster no DOM
2. Colocar em um container oculto com as dimensões reais em pixels (3508px ou 4961px de largura)
3. Capturar com `html2canvas` em `scale: 1` (sem upscale, já está no tamanho certo)
4. Gerar PNG e oferecer download direto
5. Remover o clone

Isso garante que o PNG tenha exatamente a resolução de impressão, com o layout idêntico ao preview.

### Alterações

#### 1. `src/pages/Index.tsx` — substituir `downloadPDF` por `downloadPNG`

- Remover toda a lógica de `window.print()` e injeção de `@page`
- Implementar:
  - Criar container oculto (`position: fixed; left: -9999px`) com largura A3 ou A2 em pixels
  - Clonar o `.poster` para dentro dele
  - Usar `html2canvas` com `scale: 1`, `useCORS: true`
  - Converter para blob PNG
  - Acionar download automático com `<a download>`
  - Limpar o clone

- Alterar o texto do botão de "Exportar PDF" para "Exportar PNG (alta resolução)"

#### 2. `src/App.css` — remover bloco `@media print`

- Remover as linhas 354-382 (`@media print { ... }`) que não serão mais usadas
- Manter todo o restante intacto

#### 3. Manter `html2canvas` no `package.json`, remover `jspdf`

- `jspdf` deixa de ser necessário (não geramos mais PDF)
- `html2canvas` continua sendo usado para a captura

### Resolução para impressão de parede

| Formato | Largura (px) | Altura (px) | DPI |
|---------|-------------|------------|-----|
| A3      | 3508        | 4961       | 300 |
| A2      | 4961        | 7016       | 300 |

Esses tamanhos são adequados para impressão profissional em gráfica.

### Resultado esperado
- Download automático de PNG em alta resolução
- Imagem idêntica ao preview (mesmo motor de renderização, sem conversão)
- Resolução adequada para impressão A2/A3 em gráfica
- Sem esticamento, sem bordas brancas, sem corte, sem 2 páginas
- Solução simples e confiável para um produto comercial

### Arquivos a alterar
| Arquivo | Ação |
|---------|------|
| `src/pages/Index.tsx` | Substituir export por PNG em alta resolução |
| `src/App.css` | Remover `@media print` |

