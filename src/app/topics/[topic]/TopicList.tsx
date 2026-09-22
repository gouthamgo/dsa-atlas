"use client";

import type { Problem } from "@/data/types";
import { ProblemRow } from "@/components/ProblemRow";

const RANK = { easy: 0, medium: 1, hard: 2 } as const;

export function TopicList({ problems }: { problems: Problem[] }) {
  const ordered = [...problems].sort((a, b) => RANK[a.difficulty] - RANK[b.difficulty]);
  return (
    <ul className="mt-4 overflow-hidden rounded-xl border border-[var(--line)]">
      {ordered.map((p) => (
        <ProblemRow key={p.id} problem={p} />
      ))}
    </ul>
  );
}
