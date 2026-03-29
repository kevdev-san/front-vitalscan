'use client';

function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export default function Gaugechart({ risk, color }: { risk: number; color: string }) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;

  // Arco de -215° a +35° → 250° de apertura
  const startDeg = -215;
  const endDeg   =  35;
  const totalDeg = endDeg - startDeg;
  const filledDeg = startDeg + (risk / 100) * totalDeg;

  const trackPath = arc(cx, cy, r, startDeg, endDeg);
  const fillPath  = arc(cx, cy, r, startDeg, filledDeg);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      {/* Track */}
      <path
        d={trackPath}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Fill */}
      <path
        d={fillPath}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        style={{
          transition: 'stroke 0.4s ease',
        }}
      />
      {/* Porcentaje — SIEMPRE encima, sin rotación */}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="26"
        fontWeight="800"
        fill={color}
        fontFamily="inherit"
      >
        {risk}%
      </text>
      {/* Label */}
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fontWeight="600"
        fill="#94a3b8"
        letterSpacing="0.08em"
        fontFamily="inherit"
      >
        RIESGO
      </text>
    </svg>
  );
}