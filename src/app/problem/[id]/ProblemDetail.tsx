"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Problem } from "@/data/types";
import { PATTERN_LABELS, TOPIC_LABELS } from "@/data/types";
import { useProgress, type Rating } from "@/lib/store";
import { nextDueDate } from "@/lib/review";
import { todayISO } from "@/lib/useSchedule";

const RATINGS: { value: Rating; label: string; hint: string }[] = [
  { value: "again", label: "Again", hint: "back in 3 days" },
  { value: "hard", label: "Hard", hint: "back in a week" },
  { value: "good", label: "Good", hint: "back in 3 weeks" },
];

export function ProblemDetail({ problem }: { problem: Problem }) {
  const entry = useProgress((s) => s.problems[problem.id]);
  const solve = useProgress((s) => s.solve);
  const unsolve = useProgress((s) => s.unsolve);
  const setNote = useProgress((s) => s.setNote);
  const rate = useProgress((s) => s.rate);

  const [draft, setDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDraft(entry?.notes ?? "");
    setHydrated(true);
    // Load the stored note once; later keystrokes own the field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onNoteChange(value: string) {
    setDraft(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(problem.id, value), 400);
  }

  const solved = entry?.status === "solved";

  return (
    <article className="max-w-[68ch] space-y-8">
      <header>
        <Link href={`/topics/${problem.topic}`} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
          {TOPIC_LABELS[problem.topic]}
        </Link>
        <h1 className="mt-1 font-display text-3xl font-semibold">{problem.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
          <span>{problem.difficulty}</span>
          <span>{problem.minutes} min</span>
          <Link href={`/patterns/${problem.pattern}`} className="hover:text-[var(--ink)]">
            {PATTERN_LABELS[problem.pattern]}
          </Link>
          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md border border-[var(--line)] px-2.5 py-1 hover:border-[var(--mint)] hover:text-[var(--ink)]"
          >
            Solve on LeetCode
          </a>
        </div>
      </header>

      <section>
        <button
          onClick={() => (solved ? unsolve(problem.id) : solve(problem.id))}
          className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{
            background: solved ? "var(--surface-2)" : "var(--mint)",
            color: solved ? "var(--ink)" : "var(--on-accent)",
          }}
        >
          {solved ? "Solved — undo" : "Mark solved"}
        </button>

        {solved && (
          <div className="mt-4">
            <p className="text-sm text-[var(--muted)]">How did it go?</p>
            <div className="mt-2 flex gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => rate(problem.id, r.value, nextDueDate(r.value, todayISO()))}
                  aria-pressed={entry?.rating === r.value}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    entry?.rating === r.value
                      ? "border-[var(--mint)] text-[var(--ink)]"
                      : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {r.label}
                  <span className="ml-2 text-xs opacity-70">{r.hint}</span>
                </button>
              ))}
            </div>
            {entry?.dueAt && (
              <p className="mt-2 text-xs text-[var(--muted)]">Comes back on {entry.dueAt}.</p>
            )}
          </div>
        )}
      </section>

      <section>
        <label htmlFor="notes" className="font-display text-lg font-bold">
          Your approach
        </label>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Write the idea and the complexity in your own words. This is what you will reread before an interview.
        </p>
        <textarea
          id="notes"
          value={hydrated ? draft : ""}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={8}
          placeholder="Sort, then two pointers from both ends. O(n log n) time, O(1) extra space."
          className="mt-3 w-full resize-y rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 text-sm outline-none focus:border-[var(--mint)]"
        />
      </section>
    </article>
  );
}
