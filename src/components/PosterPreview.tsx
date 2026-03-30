import { useMemo, forwardRef } from 'react';
import { format, parse } from 'date-fns';
import { WEEKS, type PosterState } from '@/data/posterData';
import { getPanelType } from '@/data/panelTypes';

interface PosterPreviewProps {
  state: PosterState;
  posterHeight?: number;
}

const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(({ state: st, posterHeight }, ref) => {
  const panel = getPanelType(st.panelType);
  const t = panel.tones[st.tone] || Object.values(panel.tones)[0];
  const l = st.lang;
  const lb = panel.labels[l] || panel.labels['pt'];
  const yr = l === 'pt' ? 'anos' : l === 'es' ? 'años' : 'years';
  const wkLabel = l === 'pt' ? 'semanas' : 'weeks';

  const alMap: Record<string, Record<string, string>> = {
    movimento: { pt: 'uma vida ativa', en: 'an active life', es: 'una vida activa' },
    espiritual: { pt: 'uma vida espiritual', en: 'a spiritual life', es: 'una vida espiritual' },
    casal: { pt: 'uma vida a dois', en: 'a life together', es: 'una vida en pareja' },
    prosperidade: { pt: 'uma vida próspera', en: 'a prosperous life', es: 'una vida próspera' },
    lazer: { pt: 'uma vida com lazer', en: 'a life with leisure', es: 'una vida con ocio' },
    leitura: { pt: 'uma vida de leitura', en: 'a life of reading', es: 'una vida de lectura' },
    social: { pt: 'uma vida conectada', en: 'a connected life', es: 'una vida conectada' },
  };
  const al = alMap[st.panelType]?.[l] || alMap['movimento'][l];

  const total = st.expect * WEEKS;
  const lived = st.birth ? Math.min(Math.floor((Date.now() - parse(st.birth, 'yyyy-MM-dd', new Date()).getTime()) / 6048e5), total) : 0;
  const left = Math.max(0, total - lived);

  const isCouple = st.panelType === 'casal';

  const marriageWeekIdx = useMemo(() => {
    if (!st.birth || !st.marriageDate) return null;
    const birthTime = parse(st.birth, 'yyyy-MM-dd', new Date()).getTime();
    const marriageTime = parse(st.marriageDate, 'yyyy-MM-dd', new Date()).getTime();
    if (marriageTime <= birthTime) return null;
    return Math.floor((marriageTime - birthTime) / 6048e5);
  }, [st.birth, st.marriageDate]);

  const decadeItems = useMemo(() => {
    const items = [];
    for (let y = 0; y < st.expect; y++) {
      items.push({ year: y, label: y % 10 === 0 ? y : null, decSep: y > 0 && y % 10 === 0 });
    }
    return items;
  }, [st.expect]);

  const yearRows = useMemo(() => {
    const rows = [];
    for (let y = 0; y < st.expect; y++) {
      const cells = [];
      for (let w = 0; w < WEEKS; w++) {
        const idx = y * WEEKS + w;
        if (isCouple && marriageWeekIdx !== null && idx >= marriageWeekIdx && idx < lived) {
          cells.push('marriage');
        } else {
          cells.push(idx < lived ? 'lived' : 'future');
        }
      }
      rows.push({ year: y, decSep: y > 0 && y % 10 === 0, cells });
    }
    return rows;
  }, [st.expect, lived, isCouple, marriageWeekIdx]);

  const hasDedic = st.dedic.trim().length > 0;

  const marriageLabelMap: Record<string, string> = { pt: 'Casamento', en: 'Wedding', es: 'Boda' };

  return (
    <div ref={ref} className={`poster ${st.theme}`} style={posterHeight ? { height: posterHeight } : undefined}>
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
          <div className="pf-val">{st.birth ? format(parse(st.birth, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy') : '\u00a0'}</div>
        </div>
        <div className="pf">
          <span className="pf-label">{lb.exp}</span>
          <div className="pf-val">{st.expect} {yr}</div>
        </div>
      </div>

      {isCouple && st.partnerName && (
        <div className="pf-row" style={{ marginTop: -10, marginBottom: 4 }}>
          <div className="pf" style={{ flex: 2 }}>
            <span className="pf-label">{lb.partner || 'Cônjuge'}</span>
            <div className="pf-val">{st.partnerName}</div>
          </div>
          <div className="pf">
            <span className="pf-label">{lb.marriage || 'Casamento'}</span>
            <div className="pf-val">{st.marriageDate ? format(parse(st.marriageDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy') : '\u00a0'}</div>
          </div>
        </div>
      )}

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
            {decadeItems.map((d) =>
            <div
              key={d.year}
              className={`dec-lbl${d.decSep ? ' dec-sep' : ''}`}
              style={{ flex: 1 }}>
                {d.label !== null ? d.label : ''}
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

          {isCouple && (
            <div className="pl-item"><div className="pl-cell c-marriage" /><span className="pl-text">{marriageLabelMap[l] || 'Casamento'}</span></div>
          )}
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
