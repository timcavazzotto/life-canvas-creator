-- Add user_id to affiliates
ALTER TABLE public.affiliates ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add commission_paid to orders
ALTER TABLE public.orders ADD COLUMN commission_paid boolean NOT NULL DEFAULT false;

-- Create commission_payments table
CREATE TABLE public.commission_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL,
  paid_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.commission_payments ENABLE ROW LEVEL SECURITY;

-- RLS: Admin can do everything on commission_payments
CREATE POLICY "Admins can select commission_payments"
  ON public.commission_payments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert commission_payments"
  ON public.commission_payments FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: Affiliate can see own commission_payments
CREATE POLICY "Affiliates can view own payments"
  ON public.commission_payments FOR SELECT TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM public.affiliates WHERE user_id = auth.uid()
    )
  );

-- RLS: Affiliate can see own record in affiliates table
CREATE POLICY "Affiliates can view own record"
  ON public.affiliates FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- RLS: Affiliate can see own orders
CREATE POLICY "Affiliates can view own orders"
  ON public.orders FOR SELECT TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM public.affiliates WHERE user_id = auth.uid()
    )
  );

-- Create trigger to auto-link affiliate user_id on signup
CREATE OR REPLACE FUNCTION public.link_affiliate_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.affiliates
  SET user_id = NEW.id
  WHERE email = NEW.email AND user_id IS NULL;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_link_affiliate
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.link_affiliate_on_signup();