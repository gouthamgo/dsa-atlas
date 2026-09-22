"use client";

import { useState } from "react";
import Link from "next/link";
import type { Problem } from "@/data/types";
import { PATTERN_LABELS } from "@/data/types";
import { useProgress } from "@/lib/store";

const DIFFICULTY_COLOR = {
  easy: "var(--easy)",
  medium: "var(--medium)",
  hard: "var(--hard)",
} as const;

/** Columns here must match the header row in ProblemTable. */
export function ProblemRow({ problem }: { problem: Problem }) {
  const status = useProgress((s) => s.problems[problem.id]?.status ?? "todo");
  const notes = useProgress((s) => s.problems[problem.id]?.notes);
  const solve = useProgress((s) => s.solve);
  const unsolve = useProgress((s) => s.unsolve);
  const solved = status === "solved";
  const [justSolved, setJustSolved] = useState(false);

  function toggle() {
    if (solved) {
      unsolve(problem.id);
      return;
    }
    solve(problem.id);
    setJustSolved(true);
    setTimeout(() => setJustSolved(false), 700);
  }

  return (
    <li
      className={`flex items-center gap-3 border-b border-[var(--line)] px-3 py-2.5 transition-colors last:border-b-0 hover:bg-[var(--surface)] ${
        justSolved ? "animate-[solved_0.7s_ease-out]" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={solved}
        onChange={toggle}
        aria-label={`Mark ${problem.title} solved`}
        className="size-5 shrink-0 cursor-pointer appearance-none rounded-md border border-[var(--line)] bg-[var(--surface)] transition-colors checked:border-[var(--mint)] checked:bg-[var(--mint)] checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M3.5 8.5l3 3 6-7%22 fill=%22none%22 stroke=%22%2306202a%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] checked:bg-center checked:bg-no-repeat hover:border-[var(--mint)]"
      />

      <span
        aria-hidden
        title={problem.difficulty}
        className="h-7 w-[3px] shrink-0 rounded-full"
        style={{ background: DIFFICULTY_COLOR[problem.difficulty] }}
      />

      <div className="min-w-0 flex-1">
        <Link
          href={`/problem/${problem.id}`}
          className={`block truncate text-[15px] ${solved ? "text-[var(--muted)] line-through" : ""}`}
        >
          {problem.title}
        </Link>
        <div className="flex gap-2 text-xs text-[var(--muted)] sm:hidden">
          <span>{PATTERN_LABELS[problem.pattern]}</span>
          <span>{problem.minutes} min</span>
          {notes && <span>notes</span>}
        </div>
      </div>

      <Link
        href={`/patterns/${problem.pattern}`}
        className="hidden w-28 shrink-0 truncate text-xs text-[var(--muted)] hover:text-[var(--ink)] sm:block"
      >
        {PATTERN_LABELS[problem.pattern]}
      </Link>

      <span className="hidden w-14 shrink-0 text-right text-xs text-[var(--muted)] tabular-nums sm:block">
        {problem.minutes}m
      </span>

      <a
        href={problem.url}
        target="_blank"
        rel="noreferrer noopener"
        className="w-16 shrink-0 rounded-md border border-[var(--line)] py-1 text-center text-xs text-[var(--muted)] transition-colors hover:border-[var(--mint)] hover:text-[var(--ink)]"
      >
        Solve
      </a>
    </li>
  );
}
