import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProblemStatus = "todo" | "solved" | "skipped";
export type Rating = "again" | "hard" | "good";
export type PlanLength = 90 | 120 | 180;

export type Settings = { days: PlanLength; startDate: string; restEvery: number };

export type ProblemProgress = {
  status: ProblemStatus;
  solvedAt?: string;
  rating?: Rating;
  dueAt?: string;
  notes?: string;
  minutesTaken?: number;
};

export type ProgressV1 = {
  version: 1;
  settings: Settings;
  problems: Record<string, ProblemProgress>;
};

export const STORAGE_KEY = "dsa-atlas";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaults(): Omit<ProgressV1, "version"> {
  return { settings: { days: 90, startDate: today(), restEvery: 7 }, problems: {} };
}

type Actions = {
  solve: (id: string, minutesTaken?: number) => void;
  unsolve: (id: string) => void;
  skip: (id: string) => void;
  rate: (id: string, rating: Rating, dueAt: string) => void;
  setNote: (id: string, notes: string) => void;
  setDays: (days: PlanLength) => void;
  setStartDate: (startDate: string) => void;
  setRestEvery: (restEvery: number) => void;
  reset: () => void;
  replaceAll: (next: Omit<ProgressV1, "version">) => void;
};

export type ProgressState = Omit<ProgressV1, "version"> & Actions;

/** localStorage that never throws: private mode must not break the app. */
const safeStorage = createJSONStorage(() => ({
  getItem: (name: string) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      /* this session stays in memory only */
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* nothing to clean up */
    }
  },
}));

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...defaults(),

      solve: (id, minutesTaken) =>
        set((s) => ({
          problems: {
            ...s.problems,
            [id]: { ...s.problems[id], status: "solved", solvedAt: today(), minutesTaken },
          },
        })),

      unsolve: (id) =>
        set((s) => ({
          problems: {
            ...s.problems,
            [id]: { ...s.problems[id], status: "todo", solvedAt: undefined },
          },
        })),

      skip: (id) =>
        set((s) => ({
          problems: { ...s.problems, [id]: { ...s.problems[id], status: "skipped" } },
        })),

      rate: (id, rating, dueAt) =>
        set((s) => ({
          problems: {
            ...s.problems,
            [id]: { ...s.problems[id], status: s.problems[id]?.status ?? "solved", rating, dueAt },
          },
        })),

      setNote: (id, notes) =>
        set((s) => ({
          problems: {
            ...s.problems,
            [id]: { ...s.problems[id], status: s.problems[id]?.status ?? "todo", notes },
          },
        })),

      setDays: (days) => set((s) => ({ settings: { ...s.settings, days } })),
      setStartDate: (startDate) => set((s) => ({ settings: { ...s.settings, startDate } })),
      setRestEvery: (restEvery) => set((s) => ({ settings: { ...s.settings, restEvery } })),
      reset: () => set(defaults()),
      replaceAll: (next) => set({ settings: next.settings, problems: next.problems }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: safeStorage,
      partialize: (s) => ({ settings: s.settings, problems: s.problems }),
    },
  ),
);

export function exportProgress(): string {
  const { settings, problems } = useProgress.getState();
  return JSON.stringify({ version: 1, settings, problems } satisfies ProgressV1, null, 2);
}

export function importProgress(json: string): { ok: true } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }

  const data = parsed as Partial<ProgressV1>;
  const settingsOk =
    typeof data?.settings === "object" &&
    data.settings !== null &&
    [90, 120, 180].includes((data.settings as Settings).days) &&
    typeof (data.settings as Settings).startDate === "string";

  if (data?.version !== 1 || !settingsOk || typeof data.problems !== "object" || data.problems === null) {
    return { ok: false, error: "That file is not a DSA Atlas export." };
  }

  useProgress.getState().replaceAll({
    settings: data.settings as Settings,
    problems: data.problems as Record<string, ProblemProgress>,
  });
  return { ok: true };
}
