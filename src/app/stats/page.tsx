"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ALL_PROBLEMS } from "@/data/problems";
import { TOPIC_ORDER, TOPIC_LABELS } from "@/data/types";
import { useProgress } from "@/lib/store";
import { useSchedule } from "@/lib/useSchedule";

const DIFFICULTY_COLOR = { easy: "var(--mint)", medium: "var(--sand)", hard: "var(--rose)" } as const;

export default function StatsPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const progress = useProgress((s) => s.problems);
  const view = useSchedule();

  if (!ready) return <div className="h-64" aria-hidden />;

  const solved = (ids: typeof ALL_PROBLEMS) =>
    ids.filter((p) => progress[p.id]?.status === "solved").length;

  const byDifficulty = (["easy", "medium", "hard"] as const).map((d) => {
    const all = ALL_PROBLEMS.filter((p) => p.difficulty === d);
    return { difficulty: d, done: solved(all), total: all.length };
  });

  const times = Object.values(progress)
    .map((p) => p.minutesTaken)
    .filter((m): m is number => typeof m === "number");
  const avgTime = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="font-display text-3xl font-bold">Stats</h1>
        <div className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
          <Figure value={`${view.solvedCount}/${view.totalCount}`} label="problems solved" />
          <Figure value={String(view.streak)} label="day streak" />
          <Figure value={String(view.behindBy)} label="still open from past days" />
          {avgTime !== null && <Figure value={`${avgTime} min`} label="average solve time" />}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold">By difficulty</h2>
        <ul className="mt-4 space-y-3">
          {byDifficulty.map(({ difficulty, done, total }) => (
            <li key={difficulty}>
              <div className="flex justify-between text-sm">
                <span>{difficulty}</span>
                <span className="text-[var(--muted)]">
                  {done}/{total}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: total ? `${(done / total) * 100}%` : 0,
                    background: DIFFICULTY_COLOR[difficulty],
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold">By topic</h2>
        <ul className="mt-4 space-y-3">
          {TOPIC_ORDER.map((topic) => {
            const all = ALL_PROBLEMS.filter((p) => p.topic === topic);
            if (all.length === 0) return null;
            const done = solved(all);
            return (
              <li key={topic}>
                <div className="flex justify-between text-sm">
                  <Link href={`/topics/${topic}`} className="hover:underline underline-offset-4">
                    {TOPIC_LABELS[topic]}
                  </Link>
                  <span className="text-[var(--muted)]">
                    {done}/{all.length}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div
                    className="h-full rounded-full bg-[var(--mint)]"
                    style={{ width: `${(done / all.length) * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold">{value}</div>
      <div className="text-sm text-[var(--muted)]">{label}</div>
    </div>
  );
}
