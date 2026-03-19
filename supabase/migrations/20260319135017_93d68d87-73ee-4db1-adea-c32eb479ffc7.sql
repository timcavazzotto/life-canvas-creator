-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Affiliates table
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  commission_pct NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates are readable for code validation"
  ON public.affiliates FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE TRIGGER update_affiliates_updated_at
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('digital', 'impresso')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  amount_cents INTEGER NOT NULL,
  affiliate_code TEXT,
  affiliate_id UUID REFERENCES public.affiliates(id),
  commission_cents INTEGER DEFAULT 0,
  customer_name TEXT,
  address TEXT,
  observations TEXT,
  poster_config JSONB NOT NULL DEFAULT '{}',
  payment_provider TEXT DEFAULT 'infinitepay',
  payment_id TEXT,
  payment_url TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  pdf_storage_path TEXT,
  print_status TEXT DEFAULT 'pending' CHECK (print_status IN ('pending', 'sent_to_printer', 'printing', 'shipped', 'delivered')),
  tracking_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_orders_affiliate_code ON public.orders(affiliate_code);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_email ON public.orders(email);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-pdfs', 'order-pdfs', false);