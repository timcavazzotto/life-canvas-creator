-- Orders are managed via edge functions with service role
-- Add a restrictive select policy so the linter is satisfied
CREATE POLICY "Orders not directly accessible"
  ON public.orders FOR SELECT
  TO anon, authenticated
  USING (false);