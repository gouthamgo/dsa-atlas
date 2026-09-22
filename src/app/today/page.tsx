"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSchedule, todayISO } from "@/lib/useSchedule";
import { useProgress } from "@/lib/store";
import { dueProblems } from "@/lib/review";
import { ALL_PROBLEMS } from "@/data/problems";
import { DayComb } from "@/components/DayComb";
import { ProblemRow } from "@/components/ProblemRow";

export default function TodayPage() {
  // The schedule depends on stored settings, so render it after hydration.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const view = useSchedule();
  const progress = useProgress((s) => s.problems);
  const settings = useProgress((s) => s.settings);
  const iso = todayISO();

  if (!ready) return <div className="h-64" aria-hidden />;

  const due = dueProblems(progress, iso).map((id) => ALL_PROBLEMS.find((p) => p.id === id)!).filter(Boolean);
  const dayNumber = view.today ? view.today.index + 1 : null;
  const upcoming = view.schedule.filter((d) => d.date > iso).slice(0, 6);
  const solvedToday = view.today?.problems.filter((p) => progress[p.id]?.status === "solved").length ?? 0;

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.9] font-extrabold">
              {dayNumber ? `Day ${dayNumber}` : "Not started"}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {dayNumber
                ? `of ${settings.days} · ${view.solvedCount} of ${view.totalCount} problems solved`
                : `Your plan starts ${settings.startDate}`}
            </p>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-bold">{view.streak}</div>
            <div className="text-xs text-[var(--muted)]">day streak</div>
          </div>
        </div>

        <div className="mt-6">
          <DayComb schedule={view.schedule} progress={progress} todayISO={iso} />
        </div>

        {view.behindBy > 0 && (
          <p className="mt-4 text-sm text-[var(--sand)]">
            {view.behindBy} problem{view.behindBy === 1 ? "" : "s"} from earlier days still open.{" "}
            <Link href="/plan" className="underline underline-offset-4">
              Catch up
            </Link>
          </p>
        )}
      </section>

      {due.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold">Revise first</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            You rated these ones shaky. Redo them before today&apos;s work.
          </p>
          <ul className="mt-3">
            {due.map((p) => (
              <ProblemRow key={p.id} problem={p} />
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold">
            {view.today?.isRest ? "Revision day" : "Today"}
          </h2>
          {view.today && !view.today.isRest && (
            <span className="text-sm text-[var(--muted)]">
              {solvedToday}/{view.today.problems.length} · {view.today.totalMinutes} min
            </span>
          )}
        </div>

        {!view.today && (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Today falls outside your plan. Set a start date in{" "}
            <Link href="/settings" className="underline underline-offset-4">
              settings
            </Link>
            .
          </p>
        )}

        {view.today?.isRest && (
          <p className="mt-3 text-sm text-[var(--muted)]">
            No new problems today. Redo anything above, or read a{" "}
            <Link href="/patterns" className="underline underline-offset-4">
              pattern
            </Link>
            .
          </p>
        )}

        {view.today && !view.today.isRest && (
          <ul className="mt-3">
            {view.today.problems.map((p) => (
              <ProblemRow key={p.id} problem={p} />
            ))}
          </ul>
        )}
      </section>

      {upcoming.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold">Coming up</h2>
          <ol className="mt-3">
            {upcoming.map((day) => (
              <li
                key={day.index}
                className="flex items-baseline gap-4 border-b border-[var(--line)] py-2.5 last:border-b-0"
              >
                <span className="w-10 shrink-0 text-sm text-[var(--muted)]">
                  {day.index + 1}
                </span>
                <span className="flex-1 truncate text-sm text-[var(--muted)]">
                  {day.isRest ? "Revision" : day.problems.map((p) => p.title).join(", ")}
                </span>
                <span className="shrink-0 text-xs text-[var(--muted)]">
                  {day.isRest ? "—" : `${day.totalMinutes} min`}
                </span>
              </li>
            ))}
          </ol>
          <Link
            href="/plan"
            className="mt-3 inline-block text-sm text-[var(--muted)] underline underline-offset-4 hover:text-[var(--ink)]"
          >
            See the whole plan
          </Link>
        </section>
      )}
    </div>
  );
}
