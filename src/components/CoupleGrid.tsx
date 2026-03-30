import { useMemo } from 'react';
import { parse } from 'date-fns';
import { WEEKS } from '@/data/posterData';

interface CoupleGridProps {
  birth1: string | null;
  birth2: string | null;
  marriageDate: string | null;
  expect: number;
}

const CoupleGrid = ({ birth1, birth2, marriageDate, expect }: CoupleGridProps) => {
  const now = Date.now();

  const birth1Time = birth1 ? parse(birth1, 'yyyy-MM-dd', new Date()).getTime() : null;
  const birth2Time = birth2 ? parse(birth2, 'yyyy-MM-dd', new Date()).getTime() : null;
  const marriageTime = marriageDate ? parse(marriageDate, 'yyyy-MM-dd', new Date()).getTime() : null;

  const total = expect * WEEKS;
  const lived1 = birth1Time ? Math.min(Math.floor((now - birth1Time) / 6048e5), total) : 0;
  const lived2 = birth2Time ? Math.min(Math.floor((now - birth2Time) / 6048e5), total) : 0;

  // Marriage week relative to person 1's birth
  const marriageWeek1 = (birth1Time && marriageTime && marriageTime > birth1Time)
    ? Math.floor((marriageTime - birth1Time) / 6048e5)
    : null;

  const marriageYear = marriageWeek1 !== null ? Math.floor(marriageWeek1 / WEEKS) : null;

  const { preRows, postRows, decadeItems } = useMemo(() => {
    const pre: Array<{
      year: number;
      decSep: boolean;
      cells1: string[];
      cells2: string[];
    }> = [];
    const post: Array<{
      year: number;
      decSep: boolean;
      cells: string[];
    }> = [];
    const decades: Array<{ year: number; label: number | null; decSep: boolean }> = [];

    const splitYear = marriageYear ?? expect;

    for (let y = 0; y < expect; y++) {
      decades.push({ year: y, label: y % 10 === 0 ? y : null, decSep: y > 0 && y % 10 === 0 });

      if (y < splitYear) {
        const cells1 = [];
        const cells2 = [];
        for (let w = 0; w < WEEKS; w++) {
          const idx = y * WEEKS + w;
          cells1.push(idx < lived1 ? 'lived' : 'future');
          cells2.push(idx < lived2 ? 'lived' : 'future');
        }
        pre.push({ year: y, decSep: y > 0 && y % 10 === 0, cells1, cells2 });
      } else {
        const cells = [];
        for (let w = 0; w < WEEKS; w++) {
          const idx = y * WEEKS + w;
          // After marriage: both must have lived this week
          const l1 = idx < lived1;
          const l2 = idx < lived2;
          cells.push(l1 && l2 ? 'lived' : 'future');
        }
        post.push({ year: y, decSep: y > 0 && y % 10 === 0, cells });
      }
    }

    return { preRows: pre, postRows: post, decadeItems: decades };
  }, [expect, lived1, lived2, marriageYear]);

  return (
    <div className="pg">
      <div className="grid-wrap">
        <div className="decade-col">
          {decadeItems.map((d) => (
            <div
              key={d.year}
              className={`dec-lbl${d.decSep ? ' dec-sep' : ''}`}
              style={{ flex: 1 }}
            >
              {d.label !== null ? d.label : ''}
            </div>
          ))}
        </div>
        <div className="grid-main">
          <div className="year-rows">
            {/* Pre-marriage: two rows per year */}
            {preRows.map((row) => (
              <div key={`pre-${row.year}`}>
                <div className={`yr${row.decSep ? ' dec-sep' : ''}`}>
                  {row.cells1.map((cls, w) => (
                    <div key={w} className={`wk ${cls}`} />
                  ))}
                </div>
                <div className="yr" style={{ opacity: 0.6 }}>
                  {row.cells2.map((cls, w) => (
                    <div key={w} className={`wk ${cls}`} />
                  ))}
                </div>
              </div>
            ))}

            {/* Marriage marker */}
            {marriageYear !== null && (
              <div className="flex items-center justify-center py-0.5" style={{ fontSize: '0.5rem', letterSpacing: '0.1em', opacity: 0.7 }}>
                💍
              </div>
            )}

            {/* Post-marriage: single merged row */}
            {postRows.map((row) => (
              <div key={`post-${row.year}`} className={`yr${row.decSep ? ' dec-sep' : ''}`}>
                {row.cells.map((cls, w) => (
                  <div key={w} className={`wk ${cls}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoupleGrid;
