import Link from "next/link";
import { PATTERN_LABELS, PATTERN_PREREQS, type PatternId } from "@/data/types";
import { PATTERN_GUIDES } from "@/data/patterns";
import { ALL_PROBLEMS } from "@/data/problems";

export function generateStaticParams() {
  return Object.keys(PATTERN_PREREQS).map((slug) => ({ slug }));
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = slug as PatternId;
  const guide = PATTERN_GUIDES[id];

  if (!guide) return <p className="text-sm text-[var(--muted)]">No such pattern.</p>;

  const problems = ALL_PROBLEMS.filter((p) => p.pattern === id);
  const prereqs = PATTERN_PREREQS[id] as readonly PatternId[];

  return (
    <article className="max-w-[68ch] space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold">{PATTERN_LABELS[id]}</h1>
        {prereqs.length > 0 && (
          <p className="mt-2 text-sm text-[var(--muted)]">
            Learn{" "}
            {prereqs.map((r, i) => (
              <span key={r}>
                {i > 0 && " and "}
                <Link href={`/patterns/${r}`} className="underline underline-offset-4">
                  {PATTERN_LABELS[r]}
                </Link>
              </span>
            ))}{" "}
            first.
          </p>
        )}
      </header>

      <section>
        <h2 className="font-display text-lg font-bold">When it applies</h2>
        <p className="mt-2 text-[15px] leading-relaxed">{guide.tell}</p>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold">What stays true</h2>
        <p className="mt-2 text-[15px] leading-relaxed">{guide.invariant}</p>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold">{guide.example.title}</h2>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 text-[13px] leading-relaxed">
          <code>{guide.example.code}</code>
        </pre>
        <p className="mt-2 text-sm text-[var(--muted)]">{guide.complexity}</p>
      </section>

      {problems.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-bold">Problems using it</h2>
          <ul className="mt-2 space-y-1">
            {problems.map((p) => (
              <li key={p.id}>
                <Link href={`/problem/${p.id}`} className="text-[15px] hover:underline underline-offset-4">
                  {p.title}
                </Link>
                <span className="ml-2 text-xs text-[var(--muted)]">{p.difficulty}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
