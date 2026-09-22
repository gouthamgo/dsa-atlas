import Link from "next/link";
import { PATTERN_LABELS, PATTERN_PREREQS, type PatternId } from "@/data/types";
import { PATTERN_GUIDES } from "@/data/patterns";
import { ALL_PROBLEMS } from "@/data/problems";

export default function PatternsPage() {
  const patterns = Object.keys(PATTERN_PREREQS) as PatternId[];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Patterns</h1>
      <p className="mt-1 max-w-[60ch] text-sm text-[var(--muted)]">
        Interviews reward recognition, not recall. Each page gives you the tell, the invariant and one
        worked example.
      </p>

      <ul className="mt-6 grid gap-px overflow-hidden rounded-lg bg-[var(--line)] sm:grid-cols-2">
        {patterns.map((p) => {
          const count = ALL_PROBLEMS.filter((x) => x.pattern === p).length;
          return (
            <li key={p} className="bg-[var(--bg)]">
              <Link href={`/patterns/${p}`} className="block p-4 hover:bg-[var(--surface)]">
                <div className="font-display font-bold">{PATTERN_LABELS[p]}</div>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{PATTERN_GUIDES[p].tell}</p>
                <div className="mt-2 text-xs text-[var(--muted)]">{count} problems</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
