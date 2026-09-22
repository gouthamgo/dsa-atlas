"use client";

import { buildGraph } from "@/lib/patternGraph";
import { PATTERN_LABELS } from "@/data/types";

/** A still of the real pattern graph, with the first three columns opened up. */
export function MiniMap() {
  const { nodes, edges, width, height } = buildGraph({});
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const pad = 30;

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`}
      className="h-auto w-full"
      role="img"
      aria-label="The pattern map: every technique and what it builds on"
    >
      {edges.map(({ from, to }) => {
        const a = nodeById.get(from);
        const b = nodeById.get(to);
        if (!a || !b) return null;
        const midX = (a.x + b.x) / 2;
        return (
          <path
            key={`${from}-${to}`}
            d={`M ${a.x + 62} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x - 62} ${b.y}`}
            fill="none"
            stroke="var(--line)"
            strokeWidth={1}
          />
        );
      })}
      {nodes.map((n) => {
        const open = n.depth === 0;
        return (
          <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
            <rect
              x={-62}
              y={-19}
              width={124}
              height={38}
              rx={9}
              fill={open ? "color-mix(in srgb, var(--mint) 18%, transparent)" : "var(--surface-2)"}
              stroke={open ? "var(--mint)" : "var(--line)"}
              strokeWidth={1}
              strokeDasharray={n.depth > 1 ? "4 4" : undefined}
              opacity={n.depth > 2 ? 0.55 : 1}
            />
            <text
              textAnchor="middle"
              y={4}
              fill={n.depth > 1 ? "var(--muted)" : "var(--ink)"}
              fontSize={10}
              fontWeight={600}
            >
              {PATTERN_LABELS[n.id].length > 19
                ? PATTERN_LABELS[n.id].slice(0, 18) + "…"
                : PATTERN_LABELS[n.id]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
