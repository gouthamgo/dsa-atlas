"use client";

import type { Problem } from "@/data/types";
import { ProblemRow } from "@/components/ProblemRow";

export function TopicList({ problems }: { problems: Problem[] }) {
  return (
    <ul className="mt-6">
      {problems.map((p) => (
        <ProblemRow key={p.id} problem={p} />
      ))}
    </ul>
  );
}
