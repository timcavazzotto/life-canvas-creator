
DROP FUNCTION IF EXISTS public.validate_affiliate_code(text);

CREATE FUNCTION public.validate_affiliate_code(_code text)
RETURNS TABLE(id uuid, name text, discount_pct numeric, commission_pct numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, discount_pct, commission_pct
  FROM public.affiliates
  WHERE code = upper(trim(_code))
    AND active = true
  LIMIT 1;
$$;
