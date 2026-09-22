# DSA Atlas

A dated plan for data structures and algorithms, not another topic list.

Pick a start date and a length — 90, 120 or 180 days — and get a day-by-day
schedule: what to solve today, what comes back for revision, and whether you are
ahead or behind. Progress lives in your browser; there is no account and no server.

## How it differs from a tracker

- **Days, not topics.** The scheduler orders problems so a technique is always
  taught before it is needed, then balances each day by *minutes*, so a day of
  hard DP is not five hours while a day of easy arrays is forty minutes.
- **Every seventh day is revision.** Problems you rated shaky come back after
  3, 7 or 21 days, capped so revision never buries new work.
- **Patterns first.** Each pattern page gives the tell, the invariant and one
  worked example — the three things that make a problem recognisable.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # scheduler, review and storage logic
npm run build   # static export to out/
```

## How it is built

Next.js 15 (static export), TypeScript, Tailwind, Zustand. The schedule is a pure
function of the dataset and your settings, derived on every render and never
stored — which is why changing plan length can't corrupt your progress. Progress
is keyed by problem id in localStorage, with JSON export and import to move
between devices.

- `src/data/` — the curriculum: problems, topics, patterns
- `src/lib/scheduler.ts` — builds the dated plan
- `src/lib/review.ts` — spaced revision
- `src/lib/store.ts` — persisted progress
- `docs/superpowers/` — the design spec and implementation plan
