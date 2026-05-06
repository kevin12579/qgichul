export default function LineChart({ data, width = 560, height = 180, color = '#1f6feb' }) {
  const pad = { t: 14, r: 18, b: 26, l: 32 };
  const w = width - pad.l - pad.r, h = height - pad.t - pad.b;
  const max = 100;
  if (!data || data.length < 2) return null;
  const xStep = w / (data.length - 1);
  const pts = data.map((d, i) => [pad.l + i * xStep, pad.t + h - (d.accuracy / max) * h]);
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const area = `${line} L ${pts[pts.length - 1][0]} ${pad.t + h} L ${pts[0][0]} ${pad.t + h} Z`;

  return (
    <svg width={width} height={height} style={{ width: '100%', maxWidth: width }}>
      {[0, 25, 50, 75, 100].map(v => {
        const y = pad.t + h - (v / max) * h;
        return (
          <g key={v}>
            <line x1={pad.l} y1={y} x2={pad.l + w} y2={y} stroke="#edf0f5" strokeWidth="1" />
            <text x={pad.l - 6} y={y + 3} textAnchor="end" style={{ fontSize: 10, fill: '#9ca3af' }}>{v}</text>
          </g>
        );
      })}
      <path d={area} fill={color} opacity="0.1" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
          <text x={x} y={pad.t + h + 16} textAnchor="middle" style={{ fontSize: 10, fill: '#6b7280' }}>
            {data[i].date}
          </text>
        </g>
      ))}
    </svg>
  );
}
