

## Plano: Teste ponta a ponta de todos os fluxos

Após revisão completa do código, aqui estão os fluxos a testar e os problemas/riscos identificados:

---

### Fluxo 1: Compra (Frontend → Checkout)
**Caminho**: Index → Configurar poster → Abrir modal → Preencher campos → "Finalizar pedido"

**O que verificar**:
- Modal abre com opção "Quadro Impresso" desativada (tag "Em breve", `pointerEvents: none`)
- Campos obrigatórios: Nome, Email, CPF (máscara 000.000.000-00), Endereço
- Validação client-side bloqueia submit se campos vazios ou CPF < 11 dígitos
- Código de afiliado: consulta tabela `affiliates` por `code` + `active = true`

**Status**: ✅ Código está correto. Validação, máscara de CPF e lógica de afiliado funcionais.

---

### Fluxo 2: Edge Function `create-checkout`
**Caminho**: Frontend envia body → Cria order no banco → Gera link InfinitePay → Retorna `payment_url`

**O que verificar**:
- Recebe `cpf`, `full_address`, `customer_name` e salva na tabela `orders`
- Busca afiliado se `affiliate_code` fornecido, calcula `commission_cents`
- Gera checkout InfinitePay com `order_nsu = order.id`, `redirect_url` e `webhook_url`

**Problema identificado**: O `redirect_url` tem um fallback hardcoded para o preview URL do Lovable. Isso funciona em dev, mas em produção precisará ser atualizado. O frontend já envia `site_url: window.location.origin`, então está coberto.

**Status**: ✅ Lógica correta. Campos `cpf` e `full_address` são aceitos e salvos.

---

### Fluxo 3: Webhook de pagamento (`payment-webhook`)
**Caminho**: InfinitePay envia POST → Marca order como `paid` → Dispara `send-to-printer` se impresso

**O que verificar**:
- Aceita `order_nsu` como identificador do pedido
- Marca `status = 'paid'`, salva `payment_id` e `paid_at`
- Para pedidos `impresso`, chama `send-to-printer` (que por agora só loga)

**⚠️ Problema potencial**: O webhook usa `order_nsu` do InfinitePay como `orderId` para buscar na tabela `orders`. O campo `id` da tabela é UUID. O `create-checkout` envia `order_nsu: order.id` (UUID) para InfinitePay. Se InfinitePay retorna o mesmo valor no webhook, funciona. Precisa confirmar que InfinitePay devolve o `order_nsu` original.

**Status**: ✅ Lógica correta, dependendo do InfinitePay devolver o `order_nsu`.

---

### Fluxo 4: Página de obrigado (`/obrigado`)
**Caminho**: Redirect após pagamento → Polling `check-order-status` a cada 3s → Exibe resultado

**O que verificar**:
- Recebe `order_id` via query string
- Faz polling até `status === 'paid'`
- Para digital: mostra botão "Baixar PDF" se `pdf_storage_path` existe
- Para impresso: mostra mensagem de envio

**⚠️ Problema**: Não há geração automática de PDF. O campo `pdf_storage_path` nunca é preenchido por nenhuma edge function. O fluxo digital ficará preso na mensagem "O PDF está sendo gerado. Você receberá o link por e-mail em breve." para sempre.

**Status**: ❌ Falta implementar geração de PDF para pedidos digitais.

---

### Fluxo 5: Admin - Visualização de pedidos
**Caminho**: `/admin` → OrderManager → Tabela com filtros → Modal de detalhes

**O que verificar**:
- Exibe CPF e endereço completo no modal de detalhes
- CPF usa `(selected as any).cpf` — cast forçado porque o tipo gerado pode não ter esses campos ainda

**⚠️ Problema**: O cast `(selected as any).cpf` e `(selected as any).full_address` indica que os tipos TypeScript não foram regenerados após a migração. Funciona em runtime mas sem type-safety.

**Status**: ⚠️ Funcional mas com types desatualizados.

---

### Fluxo 6: Download de PDF (client-side)
**Caminho**: Configurador → Botão "Baixar prévia" → html2canvas + jsPDF

**O que verificar**:
- Gera PDF do poster no navegador usando html2canvas
- Isso é a prévia local, não o PDF do pedido pago

**Status**: ✅ Funcional (geração client-side independente).

---

### Resumo de problemas encontrados

| # | Problema | Severidade |
|---|----------|-----------|
| 1 | **Sem geração de PDF pós-pagamento** — `pdf_storage_path` nunca é preenchido | Alta |
| 2 | **Tipos desatualizados** — `cpf` e `full_address` usam cast `as any` | Baixa |
| 3 | **Botões CSS** — o problema de visibilidade reportado anteriormente precisa ser verificado no preview | Média |

### Recomendação

O maior gap é a **geração de PDF** após pagamento confirmado. Sem isso, o fluxo digital termina na tela de "aguardando" sem nunca entregar o produto. Posso implementar uma edge function `generate-pdf` que:
1. É chamada pelo webhook após marcar como `paid`
2. Usa a `poster_config` salva no pedido para gerar o PDF server-side
3. Salva no storage bucket `order-pdfs`
4. Atualiza `pdf_storage_path` na tabela `orders`

Deseja que eu implemente isso, ou prefere testar os fluxos existentes primeiro no preview?

