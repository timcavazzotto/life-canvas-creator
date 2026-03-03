

## Plan: Fix PDF text scaling

### Problem
Setting `el.style.width = '1800px'` makes the grid cells scale up (they use `1fr` and `aspect-ratio`), but all font sizes in the poster are fixed pixel values (6px, 8.5px, 10px, 42px, etc.) — they don't scale with width. Result: huge grid, tiny text.

### Solution
Remove the width override entirely. Instead, capture the poster at its natural 660px width with a high `html2canvas` scale factor (4). The resulting high-res image, when fit to A3, will maintain correct text-to-grid proportions since everything scales uniformly.

### Changes

**`src/pages/Index.tsx`** — simplify `downloadPDF`:
- Remove the temporary `width: 1800px` / `maxWidth: none` overrides and their restoration
- Remove the `requestAnimationFrame` wait (no longer needed)
- Keep `boxShadow: none` to avoid shadow in PDF
- Use `html2canvas(el, { scale: 4 })` for high resolution
- Keep the rest (jsPDF portrait A3, margin, centering) as-is

