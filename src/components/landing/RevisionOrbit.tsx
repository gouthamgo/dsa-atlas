"use client";

/**
 * Three rings, one per interval. The dot sits where a problem re-enters the plan
 * after you rate it — the spacing is the point, so the radii are proportional.
 */
export function RevisionOrbit() {
  const rings = [
    { days: 3, label: "Again", r: 34, color: "var(--rose)" },
    { days: 7, label: "Hard", r: 60, color: "var(--sand)" },
    { days: 21, label: "Good", r: 92, color: "var(--mint)" },
  ];

  return (
    <svg viewBox="-110 -110 220 220" className="h-auto w-full max-w-[280px]" role="img" aria-label="Revision intervals: again 3 days, hard 7 days, good 21 days">
      {rings.map((ring) => (
        <g key={ring.days}>
          <circle
            cx={0}
            cy={0}
            r={ring.r}
            fill="none"
            stroke={ring.color}
            strokeOpacity={0.35}
            strokeWidth={1}
            strokeDasharray="3 5"
          />
          <circle cx={0} cy={-ring.r} r={5} fill={ring.color} />
          <text
            x={8}
            y={-ring.r + 4}
            fill="var(--muted)"
            fontSize={9}
          >
            {ring.label} · {ring.days}d
          </text>
        </g>
      ))}
      <circle cx={0} cy={0} r={13} fill="var(--surface-2)" stroke="var(--line)" />
      <text x={0} y={4} textAnchor="middle" fill="var(--ink)" fontSize={9} fontWeight={600}>
        solved
      </text>
    </svg>
  );
}
