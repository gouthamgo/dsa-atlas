# DSA Atlas — Design

**Date:** 2026-09-22
**Status:** Approved

## Problem

Existing DSA trackers (A2Z-DSA-Tracker, NeetCode) organise problems by topic and
leave scheduling to the user. A topic list answers "what exists"; it does not
answer "what do I solve today to be ready in three months". People stall because
they must decide the order and pace themselves, every day.

DSA Atlas turns a 455-problem curriculum into a dated plan: pick a start date and
a length (90, 120 or 180 days) and get a day-by-day schedule, a revision queue,
and a clear signal of whether you are ahead or behind.

## Success criteria

1. A user picks a length and start date and sees today's problems in under 5 seconds.
2. Changing plan length regenerates the schedule without losing solved state or notes.
3. Progress survives a browser refresh and moves to another device via JSON export/import.
4. The site is usable one-handed on a phone and loads on a slow connection.
5. No login, no backend, no hosting cost.

## Non-goals

- Solution code or an in-browser judge. Problems link to LeetCode.
- Accounts or cross-device sync. Export/import covers this.
- Discussion, comments or social features.
- A games section (the reference repo has one; it is noise).

## Architecture

Static Next.js site. No server, no database.

```
Problem data (TS)  ──►  Scheduler (pure fn)  ──►  Schedule (in memory)
                                                       │
Progress store (localStorage) ─────────────────────────┴──►  UI
```

**Stack:** Next.js 15 (App Router, `output: "export"`), TypeScript strict,
Tailwind CSS v4, Zustand for state, MDX for pattern explainers, Vitest for unit
tests, Playwright for one smoke test.

**Why static:** the whole app is a pure function of (dataset, settings, progress).
Nothing needs a server, so hosting is free and the site cannot break at 3am.

## Components

### 1. Dataset (`src/data/`)

One file per topic exporting `Problem[]`. Written by hand, not copied.

```ts
type Problem = {
  id: string;            // "two-sum" — stable, used as the progress key
  title: string;
  topic: TopicId;        // "arrays" | "graphs" | ...
  pattern: PatternId;    // "two-pointers" — links to the explainer page
  difficulty: "easy" | "medium" | "hard";
  url: string;           // LeetCode
  minutes: number;       // expected solve time, drives day balancing
  prereqs: PatternId[];  // patterns that must be scheduled earlier
};
```

`minutes` and `prereqs` exist for the scheduler; without them a plan is just a
list cut into equal chunks.

### 2. Scheduler (`src/lib/scheduler.ts`)

```ts
function buildSchedule(input: {
  problems: Problem[];
  days: 90 | 120 | 180;
  startDate: string;     // ISO date
  restEvery: number;     // default 7 — every 7th day is revision only
}): Day[]                 // { date, problems, totalMinutes, isRest }
```

Rules, in order:

1. **Topological order by pattern.** A problem is never scheduled before the
   patterns it depends on. Ties break by difficulty, then by topic order.
2. **Balance minutes, not counts.** Each working day targets
   `totalMinutes / workingDays`, within ±20%. Five easy array problems and two
   hard DP problems are both a day's work.
3. **Rest days.** Every `restEvery`-th day carries no new problems, only revision.
4. **Deterministic.** Same inputs, same output — this is what makes it testable.

Pure, no I/O, no dates beyond arithmetic.

### 3. Progress store (`src/lib/store.ts`)

Zustand with a `persist` middleware over localStorage, one versioned object:

```ts
type ProgressV1 = {
  version: 1;
  settings: { days: 90|120|180; startDate: string; restEvery: number };
  problems: Record<string, {
    status: "todo" | "solved" | "skipped";
    solvedAt?: string;
    rating?: "again" | "hard" | "good";
    dueAt?: string;
    notes?: string;
    minutesTaken?: number;
  }>;
};
```

A `migrate(persisted, fromVersion)` function runs on load. Every write goes
through the store; no component touches localStorage directly. Export writes this
object to a JSON file; import validates `version` and shape before replacing.

**Reads and writes are wrapped in try/catch.** Private-mode browsers throw on
localStorage access, and the site must still render.

### 4. Review queue (`src/lib/review.ts`)

After solving, rate the problem. `again` → due in 3 days, `hard` → 7, `good` →
21. Due problems appear on Today above new work, capped at 5 per day so revision
never swallows the schedule. Deliberately simpler than SM-2: fewer knobs, and the
interval is explainable in one sentence.

### 5. Pattern pages (`src/content/patterns/*.mdx`)

About 20 explainers (sliding window, two pointers, monotonic stack, binary search
on answer, union-find, topological sort, 0/1 knapsack, …). Each covers: when it
applies, the invariant, a worked example, complexity, and the tell in a problem
statement. A pattern's page is linked from every problem that uses it, and the
first problem of a pattern links to it prominently.

### 6. Routes

| Route | Purpose |
|---|---|
| `/` | Today: due revisions, today's problems, streak, behind/ahead banner |
| `/plan` | All days, collapsible, jump to any date |
| `/topics/[topic]` | Every problem in a topic with status |
| `/problem/[id]` | Notes, rating, complexity, link out to LeetCode |
| `/patterns/[slug]` | Pattern explainer |
| `/stats` | Progress by topic and difficulty, solve-time trend |
| `/settings` | Plan length, start date, export/import, reset |

## Data flow

1. On load the store rehydrates from localStorage (or seeds defaults).
2. `buildSchedule` runs from settings + dataset. Memoised; it is pure.
3. The schedule is joined with progress to render each view.
4. User actions (solve, rate, note) write to the store, which persists.

The schedule is never persisted, only derived. This is why changing plan length
cannot corrupt progress: progress is keyed by problem id, not by day.

## Error handling

| Failure | Behaviour |
|---|---|
| localStorage unavailable or throws | Render with in-memory defaults; a banner says progress will not be saved |
| Corrupt or unparseable stored JSON | Keep a backup copy under `dsa-atlas-backup`, start fresh, tell the user |
| Import file invalid | Reject before writing; the current state is untouched |
| Unknown problem id in progress (dataset changed) | Ignore on read, keep on disk — a dataset edit must not delete notes |
| Start date in the future | Show a countdown instead of "you are behind" |

## Testing

**Unit (Vitest), the logic that can silently be wrong:**
- Scheduler: every problem scheduled exactly once; prereqs respected; day load within tolerance; rest days empty; deterministic across runs; 90/120/180 all valid.
- Review: due dates per rating; the daily cap holds.
- Store: migration from a v1 fixture; corrupt JSON recovers; export→import round-trips.

**Smoke (Playwright), one test:** load, set a 90-day plan, solve today's first problem, reload, and confirm it is still solved.

UI components are not unit tested. The smoke test covers the wiring; the value is in the logic above.

## Build order

1. **Dataset + scheduler + tests** — no UI. The plan must be right before it is pretty.
2. **Shell, Today, Plan** — real data on screen.
3. **Problem page, notes, ratings, review queue.**
4. **Pattern pages.**
5. **Stats, settings, export/import.**
6. **Polish, Lighthouse pass, deploy to GitHub Pages.**

Each stage ends with a working site.

## Open question

The dataset is 455 hand-written entries. Stage 1 delivers 3 topics (about 60
problems) end to end to prove the scheduler; the rest is filled in afterwards, so
a data error is caught early rather than after 455 rows.
