
## Plano para corrigir o acesso ao admin

### Diagnóstico
O login em si está funcionando: os logs mostram autenticação bem-sucedida e o usuário `studio.mymoves@gmail.com` já tem role `admin` no backend.

O problema mais provável está no fluxo do frontend:
- `AdminLogin` faz `navigate('/admin')` logo após o `signIn`
- `AdminLayout` roda uma nova checagem assíncrona de sessão + role
- durante essa janela, o layout pode entender temporariamente que `!user || !isAdmin` e mandar de volta para `/admin/login`

Também há fragilidade no hook:
- lógica duplicada entre `onAuthStateChange` e `getSession()`
- sem tratamento explícito de erro na leitura de `user_roles`
- `loading` pode ser encerrado cedo demais em estados intermediários

### O que vou ajustar

1. **Refatorar `useAdminAuth`**
   - centralizar a verificação em uma única função
   - primeiro obter sessão/usuário
   - depois consultar `user_roles`
   - só então definir `loading = false`
   - adicionar tratamento de erro e logs de depuração

2. **Melhorar o fluxo de `AdminLogin`**
   - após `signIn`, não navegar cegamente
   - validar se o usuário autenticado realmente tem role `admin`
   - se tiver, navegar para `/admin`
   - se não tiver, mostrar mensagem clara de permissão

3. **Ajustar o guard de `AdminLayout`**
   - evitar redirect enquanto a checagem ainda está em andamento
   - redirecionar apenas quando a verificação estiver concluída com segurança
   - manter estado de carregamento estável para não gerar “bounce” de rota

4. **Adicionar mensagens de erro úteis**
   - diferenciar:
     - credenciais inválidas
     - usuário autenticado sem permissão admin
     - falha ao consultar permissões

### Arquivos a alterar
- `src/hooks/useAdminAuth.ts`
- `src/pages/AdminLogin.tsx`
- `src/components/admin/AdminLayout.tsx`

### Resultado esperado
```text
/login admin
→ autentica
→ confirma role admin
→ entra em /admin sem voltar para /admin/login
```

### Detalhe técnico
Hoje o backend está correto:
- login funciona
- `user_roles` contém `admin` para o usuário atual
- a falha está no sincronismo entre autenticação, consulta de role e navegação protegida no React
