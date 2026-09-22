"use client";

import { useState } from "react";
import type { Frame } from "@/data/lessons";

const CELL = 48;
const GAP = 4;
const STRIDE = CELL + GAP;

const MARK_STYLE = {
  hit: { background: "color-mix(in srgb, var(--mint) 22%, var(--surface))", borderColor: "var(--mint)", color: "var(--ink)" },
  move: { background: "color-mix(in srgb, var(--sand) 18%, var(--surface))", borderColor: "var(--sand)", color: "var(--ink)" },
  dim: { background: "transparent", borderColor: "var(--line)", color: "var(--faint)" },
} as const;

/**
 * A figure you step through yourself. Pointers and the window glide between
 * positions, so you see what moved rather than two pictures side by side.
 */
export function StepFigure({ title, frames }: { title: string; frames: Frame[] }) {
  const [i, setI] = useState(0);
  const frame = frames[i];
  const width = Math.max(...frames.map((f) => f.cells.length)) * STRIDE - GAP;

  const go = (n: number) => setI(Math.min(frames.length - 1, Math.max(0, n)));

  return (
    <figure
      className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] outline-none"
      tabIndex={0}
      aria-label={`${title}, step ${i + 1} of ${frames.length}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
    >
      <div className="flex items-baseline gap-3 border-b border-[var(--line)] px-4 py-3">
        <span className="font-mono text-[11px] tracking-wider text-[var(--faint)]">FIGURE</span>
        <span className="flex-1 text-sm text-[var(--soft)]">{title}</span>
        <span className="font-mono text-xs text-[var(--faint)] tabular-nums">
          {i + 1} / {frames.length}
        </span>
      </div>

      <div className="overflow-x-auto px-4 pt-10 pb-6">
        <div className="relative mx-auto" style={{ width, height: CELL + 58 }}>
          {frame.pointers?.map((p, k) => (
            <div
              key={k}
              className="absolute top-0 flex flex-col items-center font-mono text-[11px] transition-[left] duration-500 ease-out"
              style={{
                left: p.at * STRIDE + CELL / 2,
                transform: "translateX(-50%)",
                color: p.tone === "warn" ? "var(--sand)" : "var(--mint)",
              }}
            >
              <span className="whitespace-nowrap">{p.label}</span>
              <span aria-hidden>▾</span>
            </div>
          ))}

          {frame.window && (
            <div
              className="absolute rounded-lg border-2 transition-all duration-500 ease-out"
              style={{
                top: 28,
                left: frame.window[0] * STRIDE - 4,
                width: (frame.window[1] - frame.window[0] + 1) * STRIDE - GAP + 8,
                height: CELL + 8,
                borderColor: "var(--mint)",
                background: "color-mix(in srgb, var(--mint) 7%, transparent)",
              }}
            />
          )}

          <div className="absolute flex" style={{ top: 32, gap: GAP }}>
            {frame.cells.map((value, k) => {
              const mark = frame.marks?.find((m) => m.at === k);
              const empty = value === "";
              return (
                <div key={k} className="flex flex-col items-center">
                  <div
                    className="grid place-items-center rounded-md border font-mono text-base transition-all duration-300"
                    style={{
                      width: CELL,
                      height: CELL,
                      borderStyle: empty ? "dashed" : "solid",
                      ...(mark
                        ? MARK_STYLE[mark.tone]
                        : { borderColor: "var(--line-strong)", background: "var(--surface-2)", color: "var(--ink)" }),
                    }}
                  >
                    {value}
                  </div>
                  <span className="mt-1.5 font-mono text-[10px] text-[var(--faint)]">{k}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--line)] px-4 py-4">
        {frame.readout && (
          <p className="font-mono text-xs text-[var(--mint)]">{frame.readout}</p>
        )}
        <p className="mt-1 min-h-[3em] text-[15px] leading-relaxed text-[var(--soft)]">{frame.caption}</p>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => go(i - 1)}
            disabled={i === 0}
            aria-label="Previous step"
            className="whitespace-nowrap rounded-md border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--soft)] transition-colors hover:border-[var(--line-strong)] disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            onClick={() => go(i + 1)}
            disabled={i === frames.length - 1}
            aria-label="Next step"
            className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-opacity disabled:opacity-30"
            style={{ background: "var(--mint)", color: "var(--on-accent)" }}
          >
            Next step →
          </button>
          <div className="ml-auto hidden gap-1 sm:flex" aria-hidden>
            {frames.map((_, k) => (
              <button
                key={k}
                tabIndex={-1}
                onClick={() => go(k)}
                className="h-1.5 w-4 rounded-full transition-colors"
                style={{ background: k <= i ? "var(--mint)" : "var(--line)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
