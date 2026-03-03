

## Plan: Download PDF button using html2canvas + jsPDF

Replace `window.print()` with a proper PDF download using **html2canvas** and **jsPDF** libraries. This captures the poster as an image and places it on a single PDF page with correct sizing.

### Dependencies to add
- `html2canvas` — renders the poster DOM element to a canvas
- `jspdf` — generates a PDF from the canvas image

### Changes

**`src/pages/Index.tsx`**:
- Add a `ref` to the `.poster` element inside `PosterPreview` (need to forward ref)
- Replace `window.print()` calls with a `downloadPDF` function that:
  1. Uses `html2canvas` to capture the poster element
  2. Creates a landscape A3 jsPDF document
  3. Fits the poster image to the page
  4. Triggers `pdf.save('projeto80plus.pdf')`

**`src/components/PosterPreview.tsx`**:
- Wrap with `React.forwardRef` so the parent can get a ref to the `.poster` div

**`src/pages/Index.tsx`** — `downloadPDF` function:
```
const posterRef = useRef<HTMLDivElement>(null);

const downloadPDF = async () => {
  if (!posterRef.current) return;
  const { default: html2canvas } = await import('html2canvas');
  const { default: jsPDF } = await import('jspdf');
  const canvas = await html2canvas(posterRef.current, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  pdf.addImage(imgData, 'PNG', (pageW - w) / 2, (pageH - h) / 2, w, h);
  pdf.save('projeto80plus.pdf');
};
```

- Both "▶ Quero meu painel" buttons call `downloadPDF` instead of `window.print()`

