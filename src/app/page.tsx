"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeroComb } from "@/components/HeroComb";
import { ALL_PROBLEMS } from "@/data/problems";
import { PATTERN_LABELS, PATTERN_PREREQS, TOPIC_ORDER, type PatternId } from "@/data/types";
import { PATTERN_GUIDES } from "@/data/patterns";
import { useProgress, type PlanLength } from "@/lib/store";

const LENGTHS: { value: PlanLength; perDay: string; hint: string }[] = [
  { value: 90, perDay: "about 2 hours a day", hint: "studying full time" },
  { value: 120, perDay: "about 90 minutes a day", hint: "working full time" },
  { value: 180, perDay: "about an hour a day", hint: "no rush, more revision" },
];

export default function LandingPage() {
  const router = useRouter();
  const setDays = useProgress((s) => s.setDays);
  const setStartDate = useProgress((s) => s.setStartDate);
  const patterns = Object.keys(PATTERN_PREREQS) as PatternId[];

  function start(days: PlanLength) {
    setDays(days);
    setStartDate(new Date().toISOString().slice(0, 10));
    router.push("/today");
  }

  return (
    <div className="space-y-24 pb-16">
      <section className="pt-8">
        <p className="text-sm text-[var(--muted)]">
          {ALL_PROBLEMS.length} problems · {patterns.length} patterns · {TOPIC_ORDER.length} topics
        </p>
        <h1 className="mt-3 max-w-[18ch] font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] font-extrabold">
          Stop deciding what to solve today.
        </h1>
        <p className="mt-5 max-w-[52ch] text-lg text-[var(--muted)]">
          Every other tracker hands you a few hundred problems and wishes you luck. Atlas hands you
          a dated plan: today&apos;s problems, sized to the hours you actually have, in the order
          the techniques build on each other.
        </p>

        <div className="mt-10">
          <HeroComb />
          <p className="mt-3 text-sm text-[var(--muted)]">
            Ninety days. The short bars are revision days — every seventh one, on purpose.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-lg font-bold">How long do you have?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {LENGTHS.map((l) => (
              <button
                key={l.value}
                onClick={() => start(l.value)}
                className="group rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--mint)]"
              >
                <div className="font-display text-3xl font-extrabold">{l.value}</div>
                <div className="text-sm">days</div>
                <div className="mt-3 text-sm text-[var(--muted)]">{l.perDay}</div>
                <div className="text-xs text-[var(--muted)]">{l.hint}</div>
                <div className="mt-4 text-sm text-[var(--mint)] opacity-0 transition-opacity group-hover:opacity-100">
                  Start today
                </div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            You can change this later without losing a thing.{" "}
            <Link href="/today" className="underline underline-offset-4 hover:text-[var(--ink)]">
              Or just look around
            </Link>
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold">What the plan actually does</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          <Explainer
            title="Teaches before it tests"
            body="Sliding window never appears before two pointers. The scheduler walks a dependency graph of techniques, so nothing lands before you have the tool for it."
          />
          <Explainer
            title="Measures days in minutes"
            body="Five easy array problems and two hard DP problems are both one evening. Days are balanced by expected solve time, not by problem count."
          />
          <Explainer
            title="Brings back what you fumbled"
            body="Rate a problem again, hard or good. It returns in 3, 7 or 21 days, capped at five a day so revision never eats the plan."
          />
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-bold">Learn the tell, not the answer</h2>
          <Link href="/patterns" className="text-sm text-[var(--muted)] underline underline-offset-4 hover:text-[var(--ink)]">
            All {patterns.length} patterns
          </Link>
        </div>
        <p className="mt-2 max-w-[60ch] text-[var(--muted)]">
          Interviews reward recognition. Each pattern page gives you the signal in the problem
          statement, the invariant that makes it work, and one worked example.
        </p>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-xl bg-[var(--line)] sm:grid-cols-2">
          {patterns.slice(0, 6).map((p) => (
            <li key={p} className="bg-[var(--bg)]">
              <Link href={`/patterns/${p}`} className="block p-5 transition-colors hover:bg-[var(--surface)]">
                <div className="font-display font-bold">{PATTERN_LABELS[p]}</div>
                <p className="mt-1 text-sm text-[var(--muted)]">{PATTERN_GUIDES[p].tell}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8">
        <h2 className="max-w-[24ch] font-display text-2xl font-bold">
          Your progress stays in your browser.
        </h2>
        <p className="mt-3 max-w-[56ch] text-[var(--muted)]">
          No account, no email, no server storing what you have solved. Export a file when you want
          it on another machine. That is the whole privacy policy.
        </p>
        <button
          onClick={() => start(90)}
          className="mt-6 rounded-lg px-5 py-2.5 font-medium transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--mint)", color: "#06202a" }}
        >
          Start day 1 today
        </button>
      </section>
    </div>
  );
}

function Explainer({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-t border-[var(--line)] pt-4">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
    </div>
  );
}
