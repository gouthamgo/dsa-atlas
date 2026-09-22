"use client";

import { useState } from "react";
import Link from "next/link";
import type { Problem } from "@/data/types";
import { PATTERN_LABELS } from "@/data/types";
import { useProgress } from "@/lib/store";

const DIFFICULTY_COLOR = {
  easy: "var(--mint)",
  medium: "var(--sand)",
  hard: "var(--rose)",
} as const;

export function ProblemRow({ problem, showPattern = true }: { problem: Problem; showPattern?: boolean }) {
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
      className={`flex items-center gap-3 rounded-lg border-b border-[var(--line)] px-2 py-3 transition-colors last:border-b-0 hover:bg-[var(--surface)] ${
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
        className="h-8 w-[3px] shrink-0 rounded-full"
        style={{ background: DIFFICULTY_COLOR[problem.difficulty] }}
      />

      <div className="min-w-0 flex-1">
        <Link
          href={`/problem/${problem.id}`}
          className={`block truncate text-[15px] ${solved ? "text-[var(--muted)] line-through" : ""}`}
        >
          {problem.title}
        </Link>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--muted)]">
          <span>{problem.minutes} min</span>
          {showPattern && (
            <Link href={`/patterns/${problem.pattern}`} className="hover:text-[var(--ink)]">
              {PATTERN_LABELS[problem.pattern]}
            </Link>
          )}
          {notes ? <span title="You have notes on this one">notes</span> : null}
        </div>
      </div>

      <a
        href={problem.url}
        target="_blank"
        rel="noreferrer noopener"
        className="shrink-0 rounded-md border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--muted)] transition-colors hover:border-[var(--mint)] hover:text-[var(--ink)]"
      >
        Open
      </a>
    </li>
  );
}
