import { PATTERN_PREREQS, type PatternId } from "@/data/types";
import { ALL_PROBLEMS } from "@/data/problems";
import type { ProblemProgress } from "@/lib/store";

export type NodeState = "mastered" | "started" | "available" | "locked";

export type GraphNode = {
  id: PatternId;
  depth: number;
  x: number;
  y: number;
  solved: number;
  total: number;
  state: NodeState;
};

export type GraphEdge = { from: PatternId; to: PatternId };

/** Longest path from a root, so a technique always sits right of what it needs. */
function depthOf(id: PatternId, memo = new Map<PatternId, number>()): number {
  const cached = memo.get(id);
  if (cached !== undefined) return cached;
  const prereqs = PATTERN_PREREQS[id] as readonly PatternId[];
  const d = prereqs.length === 0 ? 0 : 1 + Math.max(...prereqs.map((p) => depthOf(p, memo)));
  memo.set(id, d);
  return d;
}

export const COLUMN_WIDTH = 190;
export const ROW_HEIGHT = 74;

export function buildGraph(progress: Record<string, ProblemProgress>): {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
} {
  const ids = Object.keys(PATTERN_PREREQS) as PatternId[];
  const memo = new Map<PatternId, number>();
  const byDepth = new Map<number, PatternId[]>();

  for (const id of ids) {
    const d = depthOf(id, memo);
    byDepth.set(d, [...(byDepth.get(d) ?? []), id]);
  }

  const maxRows = Math.max(...[...byDepth.values()].map((c) => c.length));
  const counts = new Map<PatternId, { solved: number; total: number }>();

  for (const id of ids) {
    const problems = ALL_PROBLEMS.filter((p) => p.pattern === id);
    counts.set(id, {
      solved: problems.filter((p) => progress[p.id]?.status === "solved").length,
      total: problems.length,
    });
  }

  const stateOf = (id: PatternId): NodeState => {
    const { solved, total } = counts.get(id)!;
    if (total > 0 && solved === total) return "mastered";
    if (solved > 0) return "started";
    const prereqs = PATTERN_PREREQS[id] as readonly PatternId[];
    const ready = prereqs.every((p) => (counts.get(p)?.solved ?? 0) > 0);
    return ready ? "available" : "locked";
  };

  const nodes: GraphNode[] = [];
  for (const [depth, column] of [...byDepth.entries()].sort((a, b) => a[0] - b[0])) {
    // Centre each column vertically against the tallest one.
    const offset = ((maxRows - column.length) * ROW_HEIGHT) / 2;
    column.forEach((id, i) => {
      const { solved, total } = counts.get(id)!;
      nodes.push({
        id,
        depth,
        x: depth * COLUMN_WIDTH + COLUMN_WIDTH / 2,
        y: offset + i * ROW_HEIGHT + ROW_HEIGHT / 2,
        solved,
        total,
        state: stateOf(id),
      });
    });
  }

  const edges: GraphEdge[] = [];
  for (const id of ids) {
    for (const from of PATTERN_PREREQS[id] as readonly PatternId[]) {
      edges.push({ from, to: id });
    }
  }

  return {
    nodes,
    edges,
    width: (Math.max(...nodes.map((n) => n.depth)) + 1) * COLUMN_WIDTH,
    height: maxRows * ROW_HEIGHT,
  };
}
