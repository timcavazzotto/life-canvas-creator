

## Plano: Integração de Pagamento com Afiliados + Gráfica

### Visão geral

Dois sistemas independentes que se conectam no fluxo de compra:

```text
Cliente configura poster → Checkout (InfinitePay) → Pedido salvo no banco
                                  ↓                         ↓
                        Comissão afiliada          PDF + dados enviados
                        (código de cupom)          para a gráfica (a definir)
```

---

### 1. Sistema de Afiliados com Código de Cupom

**Como funciona:**
- Cada influenciadora recebe um código (ex: `MARIA10`, `FIT2024`)
- O cliente digita o código no checkout antes de pagar
- O sistema valida o código, registra a venda vinculada à influenciadora
- Relatório simples para acompanhar vendas e comissões

**O que será construído:**
- Tabela `affiliates` no Supabase (nome, código, email, comissão %)
- Tabela `orders` com campo `affiliate_code` para rastrear
- Campo de cupom no `OrderModal` antes do botão de pagamento
- Validação do código via consulta ao banco
- Painel admin básico para ver vendas por afiliada

**Requer:** Lovable Cloud (Supabase) habilitado para banco de dados.

---

### 2. Integração de Pagamento (InfinitePay)

**Como funciona:**
- Ao clicar "Finalizar pedido", uma Edge Function cria um checkout na API da InfinitePay
- O cliente é redirecionado para a página de pagamento da InfinitePay
- Após pagamento confirmado, um webhook da InfinitePay notifica a Edge Function
- O pedido é marcado como pago no banco

**O que será construído:**
- Edge Function `create-checkout` que chama a API InfinitePay
- Edge Function `payment-webhook` para receber confirmação
- Atualização do `OrderModal` para redirecionar ao checkout
- Registro do pedido na tabela `orders` com status (pendente/pago)

**Requer:** Chave da API InfinitePay como secret no projeto.

---

### 3. Integração com Gráfica (preparação)

Como ainda não está definido o canal com a gráfica, o sistema será preparado para qualquer formato:

**O que será construído agora:**
- Geração do PDF com dados do cliente (nome, endereço, configurações do poster) salva no Supabase Storage
- Tabela `orders` com todos os dados necessários para a gráfica (endereço, tipo, status de envio)
- Edge Function `send-to-printer` pronta para ser conectada quando a gráfica definir o formato (API, email ou webhook)

**Quando a gráfica definir o canal**, basta completar a Edge Function com o método correto (fetch para API, SMTP para email, etc).

---

### Ordem de implementação sugerida

1. Habilitar Lovable Cloud (banco + edge functions)
2. Criar tabelas (`affiliates`, `orders`)
3. Implementar campo de cupom no checkout
4. Integrar InfinitePay (checkout + webhook)
5. Gerar e salvar PDF no Storage
6. Preparar Edge Function da gráfica (estrutura)

---

### Pré-requisitos

- Habilitar Lovable Cloud (Supabase)
- Chave da API InfinitePay
- Definir com a gráfica o formato de comunicação (pode ser feito depois)

