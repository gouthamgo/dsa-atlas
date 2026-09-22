"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TOPIC_ORDER, TOPIC_LABELS } from "@/data/types";
import { ALL_PROBLEMS } from "@/data/problems";
import { LESSONS, FOUNDATIONS_TITLE } from "@/data/lessons";
import { useProgress } from "@/lib/store";

export default function LearnPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const progress = useProgress((s) => s.problems);
  const written = TOPIC_ORDER.filter((t) => LESSONS[t]).length;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-xs tracking-wider text-[var(--faint)]">
        {TOPIC_ORDER.length} CHAPTERS · {written} WRITTEN · SAME ORDER AS CODING INTERVIEW PATTERNS
      </p>
      <h1 className="mt-2 text-4xl font-semibold">Learn</h1>
      <p className="mt-3 max-w-[60ch] text-lg text-[var(--muted)]">
        Nineteen patterns, in the order they build on each other — the same chapters as the book.
        Each lesson explains the idea, lets you step through it, then hands you the problems.
      </p>

      <Link
        href="/topics/foundations"
        className="mt-10 flex items-center gap-4 rounded-xl border border-[var(--line)] px-4 py-4 transition-colors hover:bg-[var(--surface)]"
      >
        <span className="w-7 font-mono text-xs text-[var(--faint)]">00</span>
        <span className="flex-1">
          <span className="block text-[15px] font-medium text-[var(--ink)]">{FOUNDATIONS_TITLE}</span>
          <span className="block text-sm text-[var(--muted)]">
            {LESSONS.foundations?.subtitle}
          </span>
        </span>
        <span className="rounded-full border border-[var(--line)] px-2 py-0.5 font-mono text-[10px] text-[var(--mint)]">
          START HERE
        </span>
      </Link>

      <ol className="mt-3 overflow-hidden rounded-xl border border-[var(--line)]">
        {TOPIC_ORDER.map((topic, i) => {
          const problems = ALL_PROBLEMS.filter((p) => p.topic === topic);
          const done = ready ? problems.filter((p) => progress[p.id]?.status === "solved").length : 0;
          const lesson = LESSONS[topic];
          return (
            <li key={topic} className="border-b border-[var(--line)] last:border-b-0">
              <Link
                href={`/topics/${topic}`}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-[var(--surface)]"
              >
                <span className="w-7 font-mono text-xs text-[var(--faint)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-medium text-[var(--ink)]">{TOPIC_LABELS[topic]}</span>
                  <span className="block text-sm text-[var(--muted)]">
                    {lesson ? lesson.subtitle : "Lesson coming — problems ready"}
                  </span>
                </span>
                {lesson && (
                  <span className="hidden rounded-full border border-[var(--line)] px-2 py-0.5 font-mono text-[10px] text-[var(--mint)] sm:inline">
                    LESSON
                  </span>
                )}
                <span className="w-14 text-right font-mono text-xs text-[var(--muted)] tabular-nums">
                  {done}/{problems.length}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-sm text-[var(--muted)]">
        Looking for a specific technique?{" "}
        <Link href="/patterns" className="underline underline-offset-4 hover:text-[var(--ink)]">
          All patterns
        </Link>{" "}
        ·{" "}
        <Link href="/map" className="underline underline-offset-4 hover:text-[var(--ink)]">
          How they connect
        </Link>
      </p>
    </div>
  );
}
