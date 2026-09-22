"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSchedule, todayISO, dayState, type DayState } from "@/lib/useSchedule";
import { useProgress, exportProgress, importProgress, type PlanLength } from "@/lib/store";
import { weeksOf, dayTitle } from "@/lib/planMeta";
import { AppShell } from "@/components/AppShell";
import { ProblemRow } from "@/components/ProblemRow";

const STATE_COLOR: Record<DayState, string> = {
  done: "var(--mint)",
  partial: "var(--sand)",
  missed: "var(--rose)",
  today: "var(--ink)",
  rest: "var(--muted)",
  future: "var(--muted)",
};

const LENGTHS: PlanLength[] = [90, 120, 180];

export default function PlanPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const view = useSchedule();
  const progress = useProgress((s) => s.problems);
  const settings = useProgress((s) => s.settings);
  const setDays = useProgress((s) => s.setDays);
  const setStartDate = useProgress((s) => s.setStartDate);
  const reset = useProgress((s) => s.reset);

  const iso = todayISO();
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const weeks = weeksOf(view.schedule);
  const currentWeek = view.today ? Math.floor(view.today.index / 7) + 1 : 1;

  useEffect(() => {
    if (ready) setOpenWeek(currentWeek);
  }, [ready, currentWeek]);

  function download() {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dsa-atlas-${iso}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = importProgress(await file.text());
    setMessage(result.ok ? "Progress restored." : result.error);
    e.target.value = "";
  }

  if (!ready) return <AppShell><div className="h-96" aria-hidden /></AppShell>;

  return (
    <AppShell>
      <header>
        <h1 className="font-display text-3xl font-semibold">Your plan</h1>
        <p className="mt-2 text-[var(--muted)]">
          {view.totalCount} problems over {settings.days} days, in the order the techniques build on
          each other. Every seventh day is revision.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-[var(--line)] py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Length</span>
          {LENGTHS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              aria-pressed={settings.days === d}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                settings.days === d
                  ? "bg-[var(--mint)] text-[var(--on-accent)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {d} days
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          Start
          <input
            type="date"
            value={settings.startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-[var(--ink)]"
          />
        </label>

        <span className="text-sm text-[var(--muted)]">
          {view.streak} day streak
          {view.behindBy > 0 ? ` · ${view.behindBy} behind` : " · on track"}
        </span>
      </div>

      <ol className="mt-6 space-y-2">
        {weeks.map((week) => {
          const problems = week.days.flatMap((d) => d.problems);
          const done = problems.filter((p) => progress[p.id]?.status === "solved").length;
          const isOpen = openWeek === week.number;
          const isNow = week.number === currentWeek;

          return (
            <li key={week.number} id={`week-${week.number}`} className="scroll-mt-24">
              <button
                onClick={() => setOpenWeek(isOpen ? null : week.number)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 border-b border-[var(--line)] py-3 text-left"
              >
                <span className="w-16 shrink-0 text-sm text-[var(--muted)]">Week {week.number}</span>
                <span className="flex-1 truncate font-medium">{week.title}</span>
                {isNow && <span className="shrink-0 text-xs text-[var(--mint)]">now</span>}
                <span className="w-20 shrink-0 text-right text-sm text-[var(--muted)] tabular-nums">
                  {done}/{problems.length}
                </span>
              </button>

              {isOpen && (
                <ol className="pl-4">
                  {week.days.map((day) => {
                    const state = dayState(day, progress, iso);
                    return (
                      <li key={day.index} id={`day-${day.index}`} className="scroll-mt-24 py-2">
                        <div className="flex items-baseline gap-3">
                          <span
                            className="w-8 shrink-0 text-sm tabular-nums"
                            style={{ color: STATE_COLOR[state] }}
                          >
                            {day.index + 1}
                          </span>
                          <span className="flex-1 text-sm text-[var(--muted)]">
                            {dayTitle(day)} · {day.date}
                          </span>
                        </div>
                        {day.problems.length > 0 && (
                          <ul className="mt-1 ml-8">
                            {day.problems.map((p) => (
                              <ProblemRow key={p.id} problem={p} />
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ol>

      <section className="mt-12 border-t border-[var(--line)] pt-6">
        <h2 className="font-display text-lg font-bold">Your progress file</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Everything is stored in this browser. Export it to move to another machine.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={download}
            className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm hover:border-[var(--mint)]"
          >
            Export
          </button>
          <button
            onClick={() => fileInput.current?.click()}
            className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm hover:border-[var(--mint)]"
          >
            Import
          </button>
          <input ref={fileInput} type="file" accept="application/json" onChange={onFile} className="hidden" />

          {confirmReset ? (
            <>
              <button
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                  setMessage("Progress cleared.");
                }}
                className="rounded-lg px-3 py-1.5 text-sm"
                style={{ background: "var(--rose)", color: "#1b0808" }}
              >
                Yes, clear everything
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--rose)]"
            >
              Clear progress
            </button>
          )}
        </div>
        {message && <p className="mt-2 text-sm text-[var(--sand)]">{message}</p>}
        <p className="mt-4 text-sm text-[var(--muted)]">
          <Link href="/map" className="underline underline-offset-4 hover:text-[var(--ink)]">
            See how the techniques connect
          </Link>
        </p>
      </section>
    </AppShell>
  );
}
