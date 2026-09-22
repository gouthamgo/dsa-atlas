"use client";

/**
 * Why days are measured in minutes: five easy problems and two hard ones are the
 * same evening. Both columns are drawn to the same total height on purpose.
 */
export function TimeBalance() {
  const columns = [
    { label: "An arrays day", blocks: [20, 20, 20, 25, 20], tone: "var(--mint)" },
    { label: "A DP day", blocks: [55, 50], tone: "var(--rose)" },
  ];
  const max = 110;

  return (
    <div className="flex items-end gap-8">
      {columns.map((col) => {
        const total = col.blocks.reduce((a, b) => a + b, 0);
        return (
          <div key={col.label} className="w-full max-w-[130px]">
            <div className="flex h-[150px] flex-col justify-end gap-1">
              {col.blocks.map((minutes, i) => (
                <div
                  key={i}
                  className="rounded-[3px]"
                  style={{
                    height: `${(minutes / max) * 150}px`,
                    background: col.tone,
                    opacity: 0.45 + (i / col.blocks.length) * 0.4,
                  }}
                  title={`${minutes} minutes`}
                />
              ))}
            </div>
            <div className="mt-3 border-t border-[var(--line)] pt-2">
              <div className="text-sm">{col.label}</div>
              <div className="text-xs text-[var(--muted)] tabular-nums">
                {col.blocks.length} problems · {total} min
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
