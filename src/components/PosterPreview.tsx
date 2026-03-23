import { useMemo, forwardRef } from 'react';
import { format } from 'date-fns';
import { WEEKS, TONES, LABELS, type PosterState } from '@/data/posterData';

interface PosterPreviewProps {
  state: PosterState;
}

const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(({ state: st }, ref) => {
  const t = TONES[st.tone];
  const l = st.lang;
  const lb = LABELS[l];
  const yr = l === 'pt' ? 'anos' : l === 'es' ? 'años' : 'years';
  const wkLabel = l === 'pt' ? 'semanas' : 'weeks';
  const al = l === 'pt' ? 'uma vida ativa' : l === 'es' ? 'una vida activa' : 'an active life';

  const total = st.expect * WEEKS;
  const lived = st.birth ? Math.min(Math.floor((Date.now() - new Date(st.birth).getTime()) / 6048e5), total) : 0;
  const left = Math.max(0, total - lived);
  const pct = lived > 0 ? Math.round(lived / total * 100) : 0;

  const decadeLabels = useMemo(() => {
    const labels = [];
    for (let d = 0; d < Math.ceil(st.expect / 10); d++) {
      const rows = Math.min(10, st.expect - d * 10);
      labels.push({ label: d * 10, rows, isFirst: d === 0 });
    }
    return labels;
  }, [st.expect]);


  const yearRows = useMemo(() => {
    const rows = [];
    for (let y = 0; y < st.expect; y++) {
      const cells = [];
      for (let w = 0; w < WEEKS; w++) {
        const idx = y * WEEKS + w;
        cells.push(idx < lived ? 'lived' : 'future');
      }
      rows.push({ year: y, decSep: y > 0 && y % 10 === 0, cells });
    }
    return rows;
  }, [st.expect, lived]);

  const hasDedic = st.dedic.trim().length > 0;

  return (
    <div ref={ref} className={`poster ${st.theme}`}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">{t.eyebrow[l]}</div>
          <div className="ph-title">PROJETO 80<span style={{ fontSize: '0.6em', verticalAlign: 'baseline', marginLeft: '0.05em' }}>+</span></div>
          <div className="ph-subtitle">{total.toLocaleString('pt-BR')} {wkLabel} · {st.expect} {yr} · {al}</div>
        </div>
        <div className="ph-right">
          <div className="ph-quote my-[13px]">{t.quote[l]}</div>
          <div className="ph-attr">{t.attr[l]}</div>
        </div>
      </div>

      <div className="pf-row">
        <div className="pf" style={{ flex: 2 }}>
          <span className="pf-label">{lb.nome}</span>
          <div className="pf-val">{st.name || '\u00a0'}</div>
        </div>
        <div className="pf">
          <span className="pf-label">{lb.nasc}</span>
          <div className="pf-val">{st.birth ? format(new Date(st.birth), 'dd/MM/yyyy') : '\u00a0'}</div>
        </div>
        <div className="pf">
          <span className="pf-label">{lb.exp}</span>
          <div className="pf-val">{st.expect} {yr}</div>
        </div>
      </div>

      {hasDedic &&
      <div className="pf-row" style={{ marginTop: -10, marginBottom: 14 }}>
          <div className="pf">
            <span className="pf-label">{lb.dedic}</span>
            <div className="pf-val italic">{st.dedic}</div>
          </div>
        </div>
      }

      <div className="pg">
        <div className="grid-wrap">
          <div className="decade-col">
            {decadeLabels.map((d, i) =>
            <div
              key={i}
              className="dec-lbl"
              style={{
                height: `${d.rows * 10.3 + (d.isFirst ? 0 : 4)}px`,
                paddingTop: d.isFirst ? 0 : '4px'
              }}>
              
                {d.label}
              </div>
            )}
          </div>
          <div className="grid-main">
            <div className="year-rows">
              {yearRows.map((row) =>
              <div key={row.year} className={`yr${row.decSep ? ' dec-sep' : ''}`}>
                  {row.cells.map((cls, w) =>
                <div key={w} className={`wk ${cls}`} />
                )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pl">
        <div className="pl-items">
          <div className="pl-item"><div className="pl-cell c-lived" /><span className="pl-text">{lb.lvd}</span></div>
          
          <div className="pl-item"><div className="pl-cell c-future" /><span className="pl-text">{lb.fut}</span></div>
        </div>
        <div className="pl-note" dangerouslySetInnerHTML={{ __html: t.note[l].replace(/\n/g, '<br>') }} />
      </div>

      <div className="pfoot">
        <div><div className="pfs-val">{total.toLocaleString('pt-BR')}</div><div className="pfs-lbl">{lb.total}</div></div>
        <div><div className="pfs-val">{lived > 0 ? lived.toLocaleString('pt-BR') : '—'}</div><div className="pfs-lbl">{lb.jv}</div></div>
        <div className="text-center"><div className="pfb-name">PROJETO 80<span style={{ fontSize: '0.7em' }}>+</span></div><div className="pfb-tag">{t.tag[l]}</div></div>
        <div><div className="pfs-val">{lived > 0 ? left.toLocaleString('pt-BR') : '—'}</div><div className="pfs-lbl">{t.ainda[l]}</div></div>
        <div><div className="pfs-val">≥150</div><div className="pfs-lbl">Min/sem · OMS</div></div>
      </div>
    </div>);

});

PosterPreview.displayName = 'PosterPreview';

export default PosterPreview;