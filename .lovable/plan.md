

## Plano: Recuperação de senha para afiliados

### O que será feito

1. **Link "Esqueci minha senha"** na aba de login do `AffiliateLogin.tsx` — ao clicar, mostra um formulário pedindo o email e envia o link de redefinição via `supabase.auth.resetPasswordForEmail()`.

2. **Página `/afiliado/redefinir-senha`** — nova rota onde o afiliado cai ao clicar no link do email. Essa página lê o token de recuperação da URL, exibe um formulário para digitar a nova senha e chama `supabase.auth.updateUser({ password })`.

3. **Rota no App.tsx** — adicionar `<Route path="/afiliado/redefinir-senha" element={<AffiliateResetPassword />} />`.

### Detalhes técnicos

- **AffiliateLogin.tsx**: Adicionar estado `forgotPassword` (boolean). Quando ativo, renderizar formulário com campo de email e botão "Enviar link". Chamar `resetPasswordForEmail(email, { redirectTo: origin + '/afiliado/redefinir-senha' })`. Link de texto "Esqueceu sua senha?" abaixo do botão de login.

- **AffiliateResetPassword.tsx** (novo arquivo):
  - No `useEffect`, verificar `onAuthStateChange` para evento `PASSWORD_RECOVERY`
  - Formulário com campo "Nova senha" e "Confirmar senha"
  - Ao submeter, chamar `supabase.auth.updateUser({ password })`
  - Após sucesso, redirecionar para `/afiliado/login`
  - Layout visual consistente com o card de login existente

- **App.tsx**: Nova rota pública `/afiliado/redefinir-senha`

### Arquivos alterados
- `src/pages/AffiliateLogin.tsx` — adicionar link e formulário de "esqueci senha"
- `src/pages/AffiliateResetPassword.tsx` — nova página de redefinição
- `src/App.tsx` — nova rota

