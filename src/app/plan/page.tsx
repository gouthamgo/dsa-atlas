"use client";

import { useEffect, useState } from "react";
import { useSchedule, todayISO, dayState } from "@/lib/useSchedule";
import { useProgress } from "@/lib/store";
import { ProblemRow } from "@/components/ProblemRow";

const STATE_LABEL = {
  done: "done",
  partial: "part done",
  missed: "missed",
  today: "today",
  rest: "revision",
  future: "",
} as const;

const STATE_COLOR = {
  done: "var(--mint)",
  partial: "var(--sand)",
  missed: "var(--rose)",
  today: "var(--ink)",
  rest: "var(--muted)",
  future: "var(--muted)",
} as const;

export default function PlanPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const view = useSchedule();
  const progress = useProgress((s) => s.problems);
  const iso = todayISO();
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (ready && view.today) setOpen(view.today.index);
  }, [ready, view.today]);

  if (!ready) return <div className="h-64" aria-hidden />;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">The plan</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {view.schedule.length} days from {view.schedule[0]?.date}. Every seventh day is for revision.
      </p>

      <ol className="mt-6">
        {view.schedule.map((day) => {
          const state = dayState(day, progress, iso);
          const done = day.problems.filter((p) => progress[p.id]?.status === "solved").length;
          const isOpen = open === day.index;

          return (
            <li key={day.index} id={`day-${day.index}`} className="border-b border-[var(--line)]">
              <button
                onClick={() => setOpen(isOpen ? null : day.index)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 py-3 text-left"
              >
                <span
                  className="w-10 shrink-0 font-display text-lg font-bold"
                  style={{ color: state === "future" ? "var(--muted)" : STATE_COLOR[state] }}
                >
                  {day.index + 1}
                </span>
                <span className="w-24 shrink-0 text-xs text-[var(--muted)]">{day.date}</span>
                <span className="flex-1 truncate text-sm">
                  {day.isRest
                    ? "Revision"
                    : day.problems.map((p) => p.title).join(", ") || "Nothing scheduled"}
                </span>
                <span className="shrink-0 text-xs" style={{ color: STATE_COLOR[state] }}>
                  {STATE_LABEL[state] || `${done}/${day.problems.length}`}
                </span>
              </button>

              {isOpen && !day.isRest && day.problems.length > 0 && (
                <ul className="pb-3 pl-14">
                  {day.problems.map((p) => (
                    <ProblemRow key={p.id} problem={p} />
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
