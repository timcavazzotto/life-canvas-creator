

## Problema

O `scale: 15` gera um canvas enorme (~9900×14000px). O `canvas.toDataURL('image/png')` produz uma string tão grande que o JavaScript lança `RangeError: Invalid string length` ao tentar processá-la no jsPDF.

## Solução

Reduzir o scale para `6` (ainda resulta em ~3960px de largura, suficiente para ~240 dpi em A3 — boa qualidade de impressão) e usar JPEG com qualidade 0.95 em vez de PNG para reduzir drasticamente o tamanho da string.

**`src/pages/Index.tsx`** — linhas 26-39:
- `scale: 15` → `scale: 6`
- `canvas.toDataURL('image/png')` → `canvas.toDataURL('image/jpeg', 0.95)`
- `'PNG'` → `'JPEG'` no `addImage`

Isso mantém qualidade alta (muito superior ao scale 4 original) sem estourar o limite de memória do browser.

