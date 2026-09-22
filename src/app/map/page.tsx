"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PATTERN_LABELS, PATTERN_PREREQS, type PatternId } from "@/data/types";
import { PATTERN_GUIDES } from "@/data/patterns";
import { useProgress } from "@/lib/store";
import { buildGraph, type NodeState } from "@/lib/patternGraph";
import { AppShell } from "@/components/AppShell";

const STATE_STYLE: Record<NodeState, { fill: string; stroke: string; text: string }> = {
  mastered: { fill: "var(--mint)", stroke: "var(--mint)", text: "#06202a" },
  started: { fill: "color-mix(in srgb, var(--mint) 22%, transparent)", stroke: "var(--mint)", text: "var(--ink)" },
  available: { fill: "var(--surface-2)", stroke: "var(--line)", text: "var(--ink)" },
  locked: { fill: "transparent", stroke: "var(--line)", text: "var(--muted)" },
};

const STATE_LABEL: Record<NodeState, string> = {
  mastered: "every problem solved",
  started: "in progress",
  available: "ready to start",
  locked: "needs earlier patterns first",
};

export default function MapPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const router = useRouter();
  const progress = useProgress((s) => s.problems);
  const [hover, setHover] = useState<PatternId | null>(null);

  const { nodes, edges, width, height } = buildGraph(ready ? progress : {});
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const selected = hover ? nodeById.get(hover) : null;
  const pad = 40;

  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-3xl font-bold">The map</h1>
          <p className="mt-2 max-w-[62ch] text-[var(--muted)]">
            Every technique and what it is built on. Solve one problem in a pattern and the
            patterns that depend on it open up. This is the order the plan follows.
          </p>
        </header>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
          {(Object.keys(STATE_STYLE) as NodeState[]).map((s) => (
            <span key={s} className="flex items-center gap-2">
              <span
                className="inline-block size-3 rounded-full"
                style={{ background: STATE_STYLE[s].fill, border: `1.5px solid ${STATE_STYLE[s].stroke}` }}
              />
              {s} — {STATE_LABEL[s]}
            </span>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface)]">
          <svg
            viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`}
            className="h-auto w-full"
            preserveAspectRatio="xMinYMid meet"
            role="img"
            aria-label="Map of patterns and their prerequisites"
          >
            {edges.map(({ from, to }) => {
              const a = nodeById.get(from);
              const b = nodeById.get(to);
              if (!a || !b) return null;
              const midX = (a.x + b.x) / 2;
              const lit = hover === from || hover === to;
              return (
                <path
                  key={`${from}-${to}`}
                  d={`M ${a.x + 66} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x - 66} ${b.y}`}
                  fill="none"
                  stroke={lit ? "var(--mint)" : "var(--line)"}
                  strokeWidth={lit ? 2 : 1.25}
                  opacity={lit ? 1 : 0.7}
                />
              );
            })}

            {nodes.map((n) => {
              const style = STATE_STYLE[n.state];
              const isHover = hover === n.id;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x} ${n.y})`}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => router.push(`/patterns/${n.id}`)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/patterns/${n.id}`)}
                  tabIndex={0}
                  role="link"
                  aria-label={`${PATTERN_LABELS[n.id]}, ${n.solved} of ${n.total} solved, ${STATE_LABEL[n.state]}`}
                  className="cursor-pointer outline-none"
                >
                  <rect
                    x={-66}
                    y={-22}
                    width={132}
                    height={44}
                    rx={10}
                    fill={style.fill}
                    stroke={isHover ? "var(--mint)" : style.stroke}
                    strokeWidth={isHover ? 2 : 1.25}
                    strokeDasharray={n.state === "locked" ? "4 4" : undefined}
                  />
                  <text
                    textAnchor="middle"
                    y={-2}
                    fill={style.text}
                    fontSize={11}
                    fontWeight={600}
                    style={{ pointerEvents: "none" }}
                  >
                    {PATTERN_LABELS[n.id].length > 20
                      ? PATTERN_LABELS[n.id].slice(0, 19) + "…"
                      : PATTERN_LABELS[n.id]}
                  </text>
                  <text
                    textAnchor="middle"
                    y={13}
                    fill={n.state === "mastered" ? "#06202a" : "var(--muted)"}
                    fontSize={10}
                    style={{ pointerEvents: "none" }}
                  >
                    {n.solved}/{n.total} solved
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="rounded-xl border border-[var(--line)] p-5">
          {selected ? (
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl font-bold">{PATTERN_LABELS[selected.id]}</h2>
                <span className="text-sm text-[var(--muted)]">
                  {selected.solved}/{selected.total} solved · {STATE_LABEL[selected.state]}
                </span>
              </div>
              <p className="mt-2 max-w-[62ch] text-sm text-[var(--muted)]">
                {PATTERN_GUIDES[selected.id].tell}
              </p>
              {(PATTERN_PREREQS[selected.id] as readonly PatternId[]).length > 0 && (
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Builds on{" "}
                  {(PATTERN_PREREQS[selected.id] as readonly PatternId[])
                    .map((p) => PATTERN_LABELS[p])
                    .join(" and ")}
                  .
                </p>
              )}
              <Link
                href={`/patterns/${selected.id}`}
                className="mt-3 inline-block text-sm underline underline-offset-4"
              >
                Open the pattern
              </Link>
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Hover a node to see what it is and what it builds on. Click to open it.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
