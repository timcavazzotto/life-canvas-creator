

## Plano: Indicador de progresso no checkout

### Problema
Ao clicar em "Finalizar pedido", o processo de captura do poster (html2canvas scale:4) + geração do PDF + upload leva vários segundos. O botão só mostra "Processando..." sem indicar o que está acontecendo, dando a impressão de travamento.

### Solução
Adicionar um estado de progresso com etapas visíveis, substituindo o conteúdo do formulário por um overlay com mensagens de progresso e uma barra animada.

### Mudanças em `src/components/OrderModal.tsx`

1. **Novo estado `loadingStep`** com valores: `'capturing'` | `'uploading'` | `'redirecting'` | `null`

2. **Atualizar `handleSubmit`** para setar o step em cada fase:
   - `'capturing'` → antes do html2canvas
   - `'uploading'` → antes do upload-poster-pdf  
   - `'redirecting'` → antes do create-checkout

3. **Overlay de progresso** quando `loading === true`: mostrar no lugar do formulário um bloco centralizado com:
   - Spinner animado (CSS puro)
   - Texto da etapa atual ("Gerando seu painel em alta resolução…", "Enviando arquivo…", "Redirecionando ao pagamento…")
   - Barra de progresso animada (component Progress do shadcn) avançando por etapa (33% → 66% → 90%)
   - Texto "Não feche esta janela" abaixo

4. **Remover o toast** de "Preparando seu painel…" (linha 77) — agora é redundante com o indicador visual.

### Arquivo
- `src/components/OrderModal.tsx`

