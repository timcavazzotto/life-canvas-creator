

## Plano: Corrigir exclusão de afiliado

### Problema
A função `deleteAffiliate` não verifica o resultado da operação. Se o delete falhar (ex: registros relacionados em `commission_payments` ou `orders`), o erro é ignorado e o toast de sucesso é exibido mesmo assim.

### Correção

**Arquivo: `src/pages/admin/AffiliateManager.tsx`**

Atualizar a função `deleteAffiliate` para:
1. Capturar o `error` retornado pelo Supabase
2. Se houver erro, exibir `toast.error` com a mensagem
3. Só exibir `toast.success` e recarregar a lista se der certo

```typescript
const deleteAffiliate = async (id: string) => {
  if (!confirm('Remover esta afiliada?')) return;
  const { error } = await supabase.from('affiliates').delete().eq('id', id);
  if (error) {
    toast.error('Erro ao remover afiliada: ' + error.message);
    return;
  }
  fetchAffiliates();
  toast.success('Afiliada removida');
};
```

Isso vai permitir que o admin veja o motivo real da falha (ex: violação de integridade referencial) em vez de um falso sucesso.

