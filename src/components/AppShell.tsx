"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/store";
import { useSchedule } from "@/lib/useSchedule";

/**
 * One column, one progress bar. What used to be a sidebar and a right rail is
 * now either on the Plan page or gone.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const view = useSchedule();
  const settings = useProgress((s) => s.settings);
  const pct = view.totalCount ? (view.solvedCount / view.totalCount) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-8">
        <div className="flex items-baseline justify-between text-sm text-[var(--muted)]">
          <span className="tabular-nums">
            {ready ? view.solvedCount : 0} of {view.totalCount} solved
          </span>
          <span className="tabular-nums">
            {ready && view.today ? `day ${view.today.index + 1} of ${settings.days}` : ""}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div
            className="h-full rounded-full bg-[var(--mint)] transition-[width] duration-700"
            style={{ width: `${ready ? pct : 0}%` }}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
