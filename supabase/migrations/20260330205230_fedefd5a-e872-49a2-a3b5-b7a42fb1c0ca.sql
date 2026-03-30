
-- 1. Create a secure RPC for affiliate code validation (anon-safe, no PII)
CREATE OR REPLACE FUNCTION public.validate_affiliate_code(_code text)
RETURNS TABLE(id uuid, discount_pct numeric, commission_pct numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, discount_pct, commission_pct
  FROM public.affiliates
  WHERE code = upper(trim(_code))
    AND active = true
  LIMIT 1;
$$;

-- 2. Drop the overly permissive anon policy
DROP POLICY IF EXISTS "Affiliates are readable for code validation" ON public.affiliates;

-- 3. Add storage policies for order-pdfs bucket
-- Admins can read order PDFs
CREATE POLICY "Admins can read order-pdfs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-pdfs'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Service role / edge functions can insert order PDFs (anon for webhook-created orders)
CREATE POLICY "Authenticated can insert order-pdfs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'order-pdfs'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Admins can delete order PDFs
CREATE POLICY "Admins can delete order-pdfs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'order-pdfs'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
