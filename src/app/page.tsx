"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ALL_PROBLEMS } from "@/data/problems";
import { PATTERN_LABELS, PATTERN_PREREQS, TOPIC_ORDER, type PatternId } from "@/data/types";
import { PATTERN_GUIDES } from "@/data/patterns";
import { useProgress, type PlanLength } from "@/lib/store";
import { HeroComb } from "@/components/HeroComb";
import { MiniMap } from "@/components/landing/MiniMap";
import { RevisionOrbit } from "@/components/landing/RevisionOrbit";
import { TimeBalance } from "@/components/landing/TimeBalance";

const LENGTHS: { value: PlanLength; perDay: string; hint: string }[] = [
  { value: 90, perDay: "about 2 hours a day", hint: "studying full time" },
  { value: 120, perDay: "about 90 minutes a day", hint: "working full time" },
  { value: 180, perDay: "about an hour a day", hint: "no rush, more revision" },
];

const SHOWCASE: PatternId = "sliding-window";

export default function LandingPage() {
  const router = useRouter();
  const setDays = useProgress((s) => s.setDays);
  const setStartDate = useProgress((s) => s.setStartDate);
  const patterns = Object.keys(PATTERN_PREREQS) as PatternId[];
  const guide = PATTERN_GUIDES[SHOWCASE];

  function start(days: PlanLength) {
    setDays(days);
    setStartDate(new Date().toISOString().slice(0, 10));
    router.push("/today");
  }

  return (
    <div className="space-y-20 pb-20">
      <section className="pt-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="max-w-[16ch] font-display text-[clamp(2.75rem,8vw,5rem)] leading-[0.92] font-extrabold">
              Stop deciding what to solve today.
            </h1>
            <p className="mt-5 max-w-[54ch] text-lg text-[var(--muted)]">
              A dated plan through every technique worth knowing, in the order they build on each
              other, sized to the hours you actually have.
            </p>
          </div>
          <dl className="grid shrink-0 grid-cols-3 gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] text-center">
            {[
              [ALL_PROBLEMS.length, "problems"],
              [patterns.length, "patterns"],
              [TOPIC_ORDER.length, "topics"],
            ].map(([n, label]) => (
              <div key={label as string} className="bg-[var(--bg)] px-5 py-3">
                <dt className="font-display text-2xl font-extrabold tabular-nums">{n}</dt>
                <dd className="text-xs text-[var(--muted)]">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {LENGTHS.map((l) => (
            <button
              key={l.value}
              onClick={() => start(l.value)}
              className="group rounded-xl border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--mint)]"
            >
              <span className="font-display text-xl font-extrabold">{l.value} days</span>
              <span className="ml-3 text-sm text-[var(--muted)]">{l.perDay}</span>
              <span className="mt-0.5 block text-xs text-[var(--muted)]">{l.hint}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <HeroComb />
          <p className="mt-3 text-sm text-[var(--muted)]">
            Ninety days at a glance. Short bars are revision days, every seventh one.
          </p>
        </div>
      </section>

      <Board
        eyebrow="The pathway"
        title="Every technique, and what it stands on"
        body="Sliding window is two pointers with a condition. Backtracking is depth-first search that undoes itself. The map holds that structure, and the plan walks it in order — nothing arrives before the thing it needs."
        aside={
          <Link href="/map" className="block rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--mint)]">
            <MiniMap />
            <span className="mt-3 block text-sm text-[var(--muted)] underline underline-offset-4">
              Open the full map
            </span>
          </Link>
        }
      />

      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>Pattern recognition</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-bold">
            Learn the tell, not the answer
          </h2>
          <p className="mt-3 max-w-[54ch] text-[var(--muted)]">
            Interviews reward recognition. Every pattern page answers the same three questions, so
            a new problem becomes a lookup rather than a puzzle.
          </p>
          <Link
            href="/patterns"
            className="mt-4 inline-block text-sm underline underline-offset-4 hover:text-[var(--ink)]"
          >
            All {patterns.length} patterns
          </Link>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-lg font-bold">{PATTERN_LABELS[SHOWCASE]}</h3>
            <span className="text-xs text-[var(--muted)]">
              {ALL_PROBLEMS.filter((p) => p.pattern === SHOWCASE).length} problems
            </span>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <Field term="Signal" desc={guide.tell} />
            <Field term="Invariant" desc={guide.invariant} />
            <Field term="Complexity" desc={guide.complexity} />
          </dl>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--bg)] p-3 text-[12px] leading-relaxed">
            <code>{guide.example.code}</code>
          </pre>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>Time balance</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-bold">A day is an evening, not a count</h2>
          <p className="mt-3 max-w-[50ch] text-[var(--muted)]">
            Most trackers give you five problems a day whether they are warm-ups or hard dynamic
            programming. Atlas fills each day to the same number of minutes instead, so the plan
            survives contact with a work week.
          </p>
          <div className="mt-6">
            <TimeBalance />
          </div>
        </div>

        <div>
          <Eyebrow>Revision</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-bold">What you fumble comes back</h2>
          <p className="mt-3 max-w-[50ch] text-[var(--muted)]">
            Rate a problem when you finish it. Again brings it back in three days, hard in a week,
            good in three weeks — capped at five a day so revision never swallows the plan.
          </p>
          <div className="mt-6 flex justify-center">
            <RevisionOrbit />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <Principle title="Structure" body="A dependency graph of techniques, walked in order, dated from the day you start." />
          <Principle title="Privacy" body="Progress lives in your browser. No account, no email, no server holding your work." />
          <Principle title="Balance" body="Days measured in minutes, a revision day every week, and a plan length that fits your life." />
        </div>
        <button
          onClick={() => start(90)}
          className="mt-8 rounded-lg px-5 py-2.5 font-medium transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--mint)", color: "#06202a" }}
        >
          Start day 1 today
        </button>
      </section>
    </div>
  );
}

function Board({
  eyebrow,
  title,
  body,
  aside,
}: {
  eyebrow: string;
  title: string;
  body: string;
  aside: React.ReactNode;
}) {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-bold">{title}</h2>
        <p className="mt-3 max-w-[52ch] text-[var(--muted)]">{body}</p>
      </div>
      <div>{aside}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="text-sm text-[var(--mint)]">{children}</span>;
}

function Field({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
      <dt className="text-[var(--muted)]">{term}</dt>
      <dd>{desc}</dd>
    </div>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-t border-[var(--line)] pt-4">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
    </div>
  );
}
