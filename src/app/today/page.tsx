"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSchedule, todayISO } from "@/lib/useSchedule";
import { useProgress } from "@/lib/store";
import { dueProblems } from "@/lib/review";
import { ALL_PROBLEMS } from "@/data/problems";
import { PATTERN_LABELS, TOPIC_LABELS } from "@/data/types";
import { dayTitle, dayReason, dayPattern, dayTopic } from "@/lib/planMeta";
import { LESSONS } from "@/data/lessons";
import { AppShell } from "@/components/AppShell";
import { ProblemRow } from "@/components/ProblemRow";

export default function TodayPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const view = useSchedule();
  const progress = useProgress((s) => s.problems);
  const settings = useProgress((s) => s.settings);
  const iso = todayISO();

  const today = view.today;
  const previous = today ? view.schedule[today.index - 1] : undefined;
  const due = ready
    ? dueProblems(progress, iso)
        .map((id) => ALL_PROBLEMS.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    : [];

  const solvedToday = today?.problems.filter((p) => progress[p.id]?.status === "solved").length ?? 0;
  const pattern = today ? dayPattern(today) : null;
  const topic = today ? dayTopic(today) : null;

  return (
    <AppShell>
      {!ready ? (
        <div className="h-96" aria-hidden />
      ) : !today ? (
        <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h1 className="font-display text-2xl font-bold">Today is outside your plan</h1>
          <p className="mt-2 text-[var(--muted)]">
            Your plan runs {settings.days} days from {settings.startDate}. Change the start date on{" "}
            <Link href="/plan" className="underline underline-offset-4">
              the plan
            </Link>{" "}
            to begin today.
          </p>
        </section>
      ) : (
        <div className="space-y-10">
          <header>
            <div className="flex flex-wrap items-baseline gap-x-3 text-sm text-[var(--muted)]">
              <span>
                Week {Math.floor(today.index / 7) + 1}, day {(today.index % 7) + 1}
              </span>
              <span>·</span>
              <span>
                Day {today.index + 1} of {settings.days}
              </span>
              {topic && (
                <>
                  <span>·</span>
                  <Link href={`/topics/${topic}`} className="hover:text-[var(--ink)]">
                    {TOPIC_LABELS[topic]}
                  </Link>
                </>
              )}
            </div>

            <h1 className="mt-1 font-display text-4xl font-semibold">{dayTitle(today)}</h1>

            <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-[var(--muted)]">
              {dayReason(today, previous)}
            </p>

            {topic && LESSONS[topic] && !today.isRest ? (
              <Link
                href={`/topics/${topic}`}
                className="mt-4 inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium"
                style={{ background: "var(--mint)", color: "var(--on-accent)" }}
              >
                Learn {TOPIC_LABELS[topic]} first
              </Link>
            ) : pattern && !today.isRest && (
              <Link
                href={`/patterns/${pattern}`}
                className="mt-3 inline-block rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm transition-colors hover:border-[var(--mint)]"
              >
                Read {PATTERN_LABELS[pattern]} first
              </Link>
            )}
          </header>

          {due.length > 0 && (
            <section>
              <SectionHead
                title="Revise first"
                meta={`${due.length} due`}
                note="You rated these shaky. Redo them before new work."
              />
              <ProblemTable>
                {due.map((p) => (
                  <ProblemRow key={p.id} problem={p} />
                ))}
              </ProblemTable>
            </section>
          )}

          <section>
            <SectionHead
              title={today.isRest ? "Nothing new today" : "Solve these"}
              meta={
                today.isRest
                  ? undefined
                  : `${solvedToday} of ${today.problems.length} done · ${today.totalMinutes} min`
              }
              note={
                today.isRest
                  ? "Every seventh day is revision. Reread a pattern, redo a problem you rated hard."
                  : undefined
              }
            />
            {!today.isRest && (
              <ProblemTable>
                {today.problems.map((p) => (
                  <ProblemRow key={p.id} problem={p} />
                ))}
              </ProblemTable>
            )}
            {solvedToday === today.problems.length && today.problems.length > 0 && (
              <p className="mt-4 rounded-lg border border-[var(--mint)] px-4 py-3 text-sm">
                Day {today.index + 1} done. Next up is{" "}
                <Link href="/plan" className="underline underline-offset-4">
                  {dayTitle(view.schedule[today.index + 1] ?? today)}
                </Link>
                .
              </p>
            )}
          </section>

        </div>
      )}
    </AppShell>
  );
}

function SectionHead({ title, meta, note }: { title: string; meta?: string; note?: string }) {
  return (
    <div className="mb-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {meta && <span className="text-sm text-[var(--muted)] tabular-nums">{meta}</span>}
      </div>
      {note && <p className="mt-1 max-w-[62ch] text-sm text-[var(--muted)]">{note}</p>}
    </div>
  );
}

/** Column headers, so a row of text reads as data rather than a list of links. */
export function ProblemTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--line)]">
      <div className="hidden items-center gap-3 border-b border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--muted)] sm:flex">
        <span className="w-5 shrink-0">Done</span>
        <span className="w-[3px] shrink-0" />
        <span className="flex-1">Problem</span>
        <span className="w-28 shrink-0">Pattern</span>
        <span className="w-14 shrink-0 text-right">Time</span>
        <span className="w-16 shrink-0 text-center">LeetCode</span>
      </div>
      <ul>{children}</ul>
    </div>
  );
}
