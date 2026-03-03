

## Plan: Move PDF print to "Quero meu painel" button & remove "PDF gratuito"

### Changes

**`src/pages/Index.tsx`**:
- Line 325: Change the "▶ Quero meu painel" button to call `window.print()` instead of opening the modal (or open modal — need clarification on intent)
- Line 326: Remove the empty line where the PDF button was (it's already empty, so no change needed)

**Wait** — the user wants the "Quero meu painel" button to generate a PDF print. But this button currently opens the checkout modal. Need to clarify: should the button do **both** (print PDF then open checkout), or **replace** checkout with print?

Given context ("implemente a impressão em pdf no botão do checkout"), the user likely wants: clicking "Quero meu painel" triggers `window.print()` so the poster prints as PDF. The checkout modal may come later with InfinitePay.

### Changes

**`src/pages/Index.tsx`** (line 325-326):
- Change `onClick` of "▶ Quero meu painel" to call `window.print()`
- Remove any remaining "PDF gratuito" button reference

**`src/App.css`** — enhance `@media print` block:
- Hide everything except `.cfg-preview` and `.poster`
- Remove poster shadow, make it full-width
- Set `@page` to landscape A3 for optimal poster layout
- Hide `.cfg-preview-hint`

