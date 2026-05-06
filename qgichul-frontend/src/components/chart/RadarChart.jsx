export default function RadarChart({ data, size = 280 }) {
  const cx = size / 2, cy = size / 2;
  const radius = size / 2 - 50;
  const n = data.length;
  const ringLevels = [20, 40, 60, 80, 100];
  const angleFor = i => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pointFor = (val, i) => {
    const a = angleFor(i);
    const r = (val / 100) * radius;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  const dataPath = data.map((d, i) => {
    const [x, y] = pointFor(d.accuracy, i);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="radar" viewBox={`0 0 ${size} ${size}`}>
      {ringLevels.map(lv => (
        <polygon
          key={lv}
          points={Array.from({ length: n }).map((_, i) => {
            const a = angleFor(i);
            const r = (lv / 100) * radius;
            return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
          }).join(' ')}
          fill="none" stroke="#e5e7eb" strokeWidth="1"
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = pointFor(100, i);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />;
      })}
      <path d={dataPath} fill="rgba(31,111,235,0.18)" stroke="#1f6feb" strokeWidth="2" strokeLinejoin="round" />
      {data.map((d, i) => {
        const [x, y] = pointFor(d.accuracy, i);
        return <circle key={i} cx={x} cy={y} r="4" fill="#1f6feb" stroke="#fff" strokeWidth="1.5" />;
      })}
      {data.map((d, i) => {
        const [lx, ly] = pointFor(118, i);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 11, fontWeight: 600, fill: '#4b5563' }}>
            {d.name.length > 9 ? d.name.slice(0, 8) + '…' : d.name}
          </text>
        );
      })}
    </svg>
  );
}
