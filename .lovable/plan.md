

## Plan: Fix PDF quality — larger poster, bigger fonts

The problem: the poster element is only 660px wide on screen with very small fonts (5-10px). When captured and placed on A3 landscape, the height constraint shrinks everything, making text unreadable and potentially causing overlap.

### Root cause
The poster's aspect ratio (tall and narrow) doesn't match A3 landscape. The `Math.min` ratio calculation constrains by height, making the poster appear small on the page.

### Solution
Before capturing with html2canvas, temporarily scale the poster to a much larger size (e.g., 1800px wide) so the rendered image has larger, crisper text. Also switch to **portrait A3** which better matches the poster's tall aspect ratio.

### Changes

**`src/pages/Index.tsx`** — update `downloadPDF` function:
1. Before capture: temporarily set poster to `width: 1800px` and remove `max-width`/`box-shadow` 
2. Use `html2canvas` with `scale: 3` for high-res capture
3. Switch jsPDF to **portrait A3** (`orientation: 'portrait'`) — better fit for tall poster
4. After capture: restore original styles
5. Add a loading toast via `sonner` while generating

**`src/App.css`** — no changes needed (the temporary styles are inline JS)

### Updated downloadPDF logic:
```js
const downloadPDF = async () => {
  if (!posterRef.current) return;
  const el = posterRef.current;
  // Save original styles
  const origWidth = el.style.width;
  const origMaxWidth = el.style.maxWidth;
  const origBoxShadow = el.style.boxShadow;
  // Temporarily enlarge for better resolution
  el.style.width = '1800px';
  el.style.maxWidth = 'none';
  el.style.boxShadow = 'none';
  
  const canvas = await html2canvas(el, { scale: 3, useCORS: true });
  
  // Restore
  el.style.width = origWidth;
  el.style.maxWidth = origMaxWidth;
  el.style.boxShadow = origBoxShadow;
  
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a3' });
  // ... fit to page with margins
  pdf.save('projeto80plus.pdf');
};
```

This ensures the poster renders at nearly 3x the original size, making all text (quotes, legends, labels) clearly readable in the final PDF, fitting neatly on a single portrait A3 page.

