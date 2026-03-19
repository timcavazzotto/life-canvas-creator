

## Plano: Criar usuário admin

### O que será feito

1. **Adicionar tela de cadastro** na rota `/admin/login` — um link "Criar conta" que alterna para um formulário de signup (email + senha), usando `supabase.auth.signUp()`

2. **Inserir role admin** — após você criar a conta com `studio.mymoves@gmail.com`, executarei um INSERT na tabela `user_roles` vinculando seu `user_id` ao papel `admin`

3. **Habilitar auto-confirm temporariamente** (opcional) — para que o signup funcione sem verificação de email durante o setup inicial

### Fluxo

```text
/admin/login → clicar "Criar conta" → signup com email/senha
→ Eu insiro o role admin no banco
→ Você faz login e acessa /admin
```

### Arquivos modificados

- `src/pages/AdminLogin.tsx` — adicionar toggle entre login e signup

### Ação no banco (após cadastro)

```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'studio.mymoves@gmail.com';
```

