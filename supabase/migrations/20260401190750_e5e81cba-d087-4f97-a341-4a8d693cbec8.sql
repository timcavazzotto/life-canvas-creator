CREATE POLICY "Admins can delete commission_payments"
ON public.commission_payments
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));