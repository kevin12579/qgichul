export default function HBar({ label, value, max = 100, color = '#1f6feb', note }) {
  return (
    <div className="hbar">
      <div className="hbar-label" title={label}>{label}</div>
      <div className="hbar-track">
        <div className="hbar-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <div className="hbar-value">{note ?? `${value}%`}</div>
    </div>
  );
}
