import { useMemo } from 'react';
import { WEEKS } from '@/data/posterData';

const DemoGrid = () => {
  const cells = useMemo(() => {
    const lived = Math.floor((Date.now() - new Date(1985, 0, 1).getTime()) / 6048e5);
    const total = 80 * WEEKS;
    return Array.from({ length: total }, (_, i) => i < lived ? 'lived' : 'future');
  }, []);

  return (
    <div className="dp-grid">
      {cells.map((cls, i) => (
        <div key={i} className={`dp-cell ${cls}`} />
      ))}
    </div>
  );
};

export default DemoGrid;
