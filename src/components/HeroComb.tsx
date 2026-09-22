"use client";

import { useEffect, useState } from "react";

/**
 * The plan itself, filling in. Ninety cells, one per day, every seventh one short
 * for revision. This is the only animation on the page — everything else is still.
 */
export function HeroComb({ days = 90 }: { days?: number }) {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setFilled(days);
      return;
    }
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      setFilled(frame);
      if (frame >= days) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [days]);

  return (
    <div className="flex h-[120px] w-full items-end gap-[2px]" aria-hidden>
      {Array.from({ length: days }, (_, i) => {
        const isRest = (i + 1) % 7 === 0;
        const on = i < filled;
        const height = isRest ? 22 : 40 + ((i * 37) % 60);
        return (
          <span
            key={i}
            className="flex-1 rounded-[2px] transition-all duration-500 ease-out"
            style={{
              height: on ? height : 6,
              background: isRest ? "var(--rest)" : "var(--mint)",
              opacity: on ? (isRest ? 0.7 : 0.35 + ((i % 9) / 9) * 0.65) : 0.12,
              boxShadow: on && !isRest ? "0 0 18px -6px var(--mint)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}
