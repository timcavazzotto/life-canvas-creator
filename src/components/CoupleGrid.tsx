import { useMemo } from 'react';
import { parse } from 'date-fns';
import { WEEKS } from '@/data/posterData';

interface CoupleGridProps {
  birth1: string | null;
  birth2: string | null;
  marriageDate: string | null;
  expect: number;
}

const HALF = Math.floor(WEEKS / 2); // 26 weeks per side

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

  const { preRows, postRows } = useMemo(() => {
    const pre: Array<{
      year: number;
      decSep: boolean;
      left: string[];   // person 1 — 26 cols
      right: string[];  // person 2 — 26 cols
    }> = [];
    const post: Array<{
      year: number;
      decSep: boolean;
      cells: string[];  // merged — 52 cols
    }> = [];

    const splitYear = marriageYear ?? expect;

    for (let y = 0; y < expect; y++) {
      const decSep = y > 0 && y % 10 === 0;

      if (y < splitYear) {
        // Pre-marriage: split weeks into two halves side by side
        const left: string[] = [];
        const right: string[] = [];
        for (let w = 0; w < HALF; w++) {
          const idx = y * WEEKS + w;
          left.push(idx < lived1 ? 'lived' : 'future');
        }
        for (let w = 0; w < HALF; w++) {
          const idx = y * WEEKS + w;
          right.push(idx < lived2 ? 'lived' : 'future');
        }
        pre.push({ year: y, decSep, left, right });
      } else {
        // Post-marriage: single merged row, 52 cols
        const cells: string[] = [];
        for (let w = 0; w < WEEKS; w++) {
          const idx = y * WEEKS + w;
          const l1 = idx < lived1;
          const l2 = idx < lived2;
          cells.push(l1 && l2 ? 'lived' : 'future');
        }
        post.push({ year: y, decSep, cells });
      }
    }

    return { preRows: pre, postRows: post };
  }, [expect, lived1, lived2, marriageYear]);

  return (
    <div className="pg">
      <div className="grid-wrap">
        {/* Decade labels */}
        <div className="decade-col">
          {Array.from({ length: expect }, (_, y) => (
            <div
              key={y}
              className={`dec-lbl${y > 0 && y % 10 === 0 ? ' dec-sep' : ''}`}
              style={{ flex: 1 }}
            >
              {y % 10 === 0 ? y : ''}
            </div>
          ))}
        </div>

        <div className="grid-main">
          <div className="year-rows">
            {/* Pre-marriage: Y shape — two columns side by side */}
            {preRows.map((row) => (
              <div
                key={`pre-${row.year}`}
                className={row.decSep ? 'dec-sep' : ''}
                style={{ display: 'flex', gap: '2px' }}
              >
                {/* Person 1 — left half */}
                <div className="yr" style={{ flex: 1 }}>
                  {row.left.map((cls, w) => (
                    <div key={w} className={`wk ${cls}`} />
                  ))}
                </div>
                {/* Person 2 — right half */}
                <div className="yr" style={{ flex: 1, opacity: 0.6 }}>
                  {row.right.map((cls, w) => (
                    <div key={w} className={`wk ${cls}`} />
                  ))}
                </div>
              </div>
            ))}

            {/* Marriage marker — convergence point */}
            {marriageYear !== null && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1px 0',
                  fontSize: '0.45rem',
                  letterSpacing: '0.1em',
                  opacity: 0.7,
                }}
              >
                💍
              </div>
            )}

            {/* Post-marriage: single full-width merged row */}
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
