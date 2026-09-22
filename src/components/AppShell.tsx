"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ALL_PROBLEMS } from "@/data/problems";
import { TOPIC_ORDER, TOPIC_LABELS } from "@/data/types";
import { useProgress } from "@/lib/store";
import { useSchedule, todayISO } from "@/lib/useSchedule";
import { weeksOf } from "@/lib/planMeta";
import { dueProblems } from "@/lib/review";
import { ProgressRing } from "@/components/ProgressRing";

/**
 * Three zones, the layout every DSA tool converges on: where you are (left),
 * what you are doing (middle), how you are going (right).
 */
export function AppShell({ children, rail = true }: { children: React.ReactNode; rail?: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const pathname = usePathname();
  const progress = useProgress((s) => s.problems);
  const view = useSchedule();
  const iso = todayISO();

  const weeks = weeksOf(view.schedule);
  const currentWeek = view.today ? Math.floor(view.today.index / 7) + 1 : null;
  const due = ready ? dueProblems(progress, iso) : [];

  return (
    <div className={`mx-auto grid w-full max-w-[1400px] gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] ${rail ? "xl:grid-cols-[220px_minmax(0,1fr)_240px]" : ""}`}>
      <aside className="hidden lg:block">
        <nav className="sticky top-20 space-y-8">
          <div>
            <SidebarHeading>Curriculum</SidebarHeading>
            <ul className="mt-2 space-y-1">
              {TOPIC_ORDER.map((topic) => {
                const all = ALL_PROBLEMS.filter((p) => p.topic === topic);
                if (all.length === 0) return null;
                const done = ready
                  ? all.filter((p) => progress[p.id]?.status === "solved").length
                  : 0;
                const active = pathname === `/topics/${topic}`;
                return (
                  <li key={topic}>
                    <Link
                      href={`/topics/${topic}`}
                      className={`flex items-baseline justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                        active
                          ? "bg-[var(--surface-2)] text-[var(--ink)]"
                          : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                      }`}
                    >
                      <span className="truncate">{TOPIC_LABELS[topic]}</span>
                      <span className="shrink-0 text-xs tabular-nums">
                        {done}/{all.length}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <SidebarHeading>The plan</SidebarHeading>
            <ul className="mt-2 space-y-1">
              {weeks.slice(0, 8).map((w) => {
                const isNow = ready && w.number === currentWeek;
                return (
                  <li key={w.number}>
                    <Link
                      href={`/plan#week-${w.number}`}
                      className={`flex items-baseline gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                        isNow
                          ? "text-[var(--mint)]"
                          : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                      }`}
                    >
                      <span className="w-12 shrink-0 text-xs">Week {w.number}</span>
                      <span className="truncate">{w.title}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/plan"
                  className="block rounded-md px-2 py-1.5 text-sm text-[var(--muted)] underline underline-offset-4 hover:text-[var(--ink)]"
                >
                  All {view.schedule.length} days
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <div className="min-w-0">
        {/* On phones the rails are hidden, so progress gets its own compact strip. */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 xl:hidden">
          <ProgressRing value={ready ? view.solvedCount : 0} total={view.totalCount} size={44} />
          <div className="flex-1 text-sm">
            <div className="font-medium tabular-nums">
              {ready ? view.solvedCount : 0}/{view.totalCount} solved
            </div>
            <div className="text-xs text-[var(--muted)]">
              {ready ? view.streak : 0} day streak ·{" "}
              {ready && view.behindBy > 0 ? `${view.behindBy} behind` : "on track"}
            </div>
          </div>
          {due.length > 0 && (
            <Link href="/today" className="shrink-0 text-xs text-[var(--sand)]">
              {due.length} to revise
            </Link>
          )}
        </div>
        {children}
      </div>

      {rail && (
      <aside className="hidden xl:block">
        <div className="sticky top-20 space-y-6">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-4">
              <ProgressRing
                value={ready ? view.solvedCount : 0}
                total={view.totalCount}
                size={64}
              />
              <div>
                <div className="font-display text-xl font-bold tabular-nums">
                  {ready ? view.solvedCount : 0}
                  <span className="text-sm font-normal text-[var(--muted)]">
                    /{view.totalCount}
                  </span>
                </div>
                <div className="text-xs text-[var(--muted)]">problems solved</div>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <Stat label="Streak" value={`${ready ? view.streak : 0} days`} />
              <Stat label="Day" value={view.today ? `${view.today.index + 1}` : "—"} />
              <Stat
                label="Behind"
                value={ready && view.behindBy > 0 ? `${view.behindBy} problems` : "on track"}
                tone={ready && view.behindBy > 0 ? "warn" : "ok"}
              />
            </dl>
          </div>

          <div className="rounded-xl border border-[var(--line)] p-4">
            <SidebarHeading>Revision queue</SidebarHeading>
            {due.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Nothing due. Rate problems after you solve them and they come back here.
              </p>
            ) : (
              <ul className="mt-2 space-y-1">
                {due.map((id) => {
                  const p = ALL_PROBLEMS.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <li key={id}>
                      <Link
                        href={`/problem/${id}`}
                        className="block truncate text-sm text-[var(--muted)] hover:text-[var(--ink)]"
                      >
                        {p.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </aside>
      )}
    </div>
  );
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-sm font-bold text-[var(--ink)]">{children}</h2>;
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "warn" | "ok" }) {
  return (
    <div className="flex justify-between">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd style={{ color: tone === "warn" ? "var(--sand)" : undefined }}>{value}</dd>
    </div>
  );
}
