import type { TopicId } from "@/data/types";

/**
 * One frame of a step-through figure: a row of cells, the pointers sitting on
 * them, and a sentence saying what just happened. Arrays, two pointers and
 * sliding windows all fit this shape.
 */
export type Frame = {
  cells: (string | number)[];
  pointers?: { label: string; at: number; tone?: "accent" | "warn" }[];
  /** Inclusive range drawn as a window over the cells. */
  window?: [number, number];
  /** Per-cell emphasis: hit = the answer, move = just changed, dim = out of play. */
  marks?: { at: number; tone: "hit" | "move" | "dim" }[];
  /** A short readout beside the figure, e.g. "sum = 12 > 10". */
  readout?: string;
  caption: string;
};

export type Lesson = {
  topic: TopicId;
  /** One line under the title: what this is, in plain words. */
  subtitle: string;
  whyInterviewer: string;
  /** The analogy. Wrap key phrases in **double asterisks** to highlight them. */
  idea: string;
  figure: { title: string; frames: Frame[] };
  code: { title: string; source: string };
  costs: { op: string; cost: string; note: string }[];
  traps: string[];
};
