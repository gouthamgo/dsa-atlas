"use client";

import Link from "next/link";
import { useState } from "react";
import { ALL_PROBLEMS } from "@/data/problems";
import { PATTERN_LABELS, TOPIC_LABELS } from "@/data/types";
import { useProgress } from "@/lib/store";

export function SearchProblems() {
  const [query, setQuery] = useState("");
  const progress = useProgress((s) => s.problems);

  const q = query.trim().toLowerCase();
  const results = q
    ? ALL_PROBLEMS.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          PATTERN_LABELS[p.pattern].toLowerCase().includes(q) ||
          TOPIC_LABELS[p.topic].toLowerCase().includes(q),
      ).slice(0, 8)
    : [];

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, pattern or topic — try “sliding window”"
        aria-label="Search problems"
        className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--mint)]"
      />

      {q && results.length === 0 && (
        <p className="mt-3 text-sm text-[var(--muted)]">
          Nothing matches “{query}”. The curriculum has {ALL_PROBLEMS.length} problems so far.
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-3 divide-y divide-[var(--line)] overflow-hidden rounded-lg border border-[var(--line)]">
          {results.map((p) => (
            <li key={p.id}>
              <Link
                href={`/problem/${p.id}`}
                className="flex items-baseline justify-between gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-[var(--surface)]"
              >
                <span className="truncate">
                  {progress[p.id]?.status === "solved" && (
                    <span className="mr-2 text-[var(--mint)]">solved</span>
                  )}
                  {p.title}
                </span>
                <span className="shrink-0 text-xs text-[var(--muted)]">
                  {PATTERN_LABELS[p.pattern]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
