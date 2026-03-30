

## Plan: Add phone field to checkout

### What changes

1. **Database migration** — Add a `phone` column (`text`, nullable) to the `orders` table.

2. **OrderModal.tsx** — Add a phone input field (with mask `(XX) XXXXX-XXXX`) between Email and CPF fields. Add `phone` state, a `formatPhone` helper, and pass `phone` in the `create-checkout` body.

3. **create-checkout edge function** — Accept `phone` from the request body and save it to the new `phone` column on order insert.

4. **Admin OrderManager** — Display the phone column in the orders table so admins can see it.

### Technical details

- **Migration SQL**: `ALTER TABLE public.orders ADD COLUMN phone text;`
- **Phone format helper**: strips non-digits, limits to 11, formats as `(XX) XXXXX-XXXX`
- **No validation required** (optional field), but will format for consistency
- Field label: `Telefone / WhatsApp (opcional)`

