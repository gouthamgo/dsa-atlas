export type Difficulty = "easy" | "medium" | "hard";

/** The 19 chapters of Coding Interview Patterns (Xu & Gunawardane), in book order. */
export const TOPIC_ORDER = [
  "two-pointers",
  "hash-maps",
  "linked-lists",
  "fast-slow-pointers",
  "sliding-windows",
  "binary-search",
  "stacks",
  "heaps",
  "intervals",
  "prefix-sums",
  "trees",
  "tries",
  "graphs",
  "backtracking",
  "dynamic-programming",
  "greedy",
  "sort-and-search",
  "bit-manipulation",
  "math-and-geometry",
] as const;

export type TopicId = (typeof TOPIC_ORDER)[number];

export const TOPIC_LABELS: Record<TopicId, string> = {
  "two-pointers": "Two Pointers",
  "hash-maps": "Hash Maps & Sets",
  "linked-lists": "Linked Lists",
  "fast-slow-pointers": "Fast & Slow Pointers",
  "sliding-windows": "Sliding Windows",
  "binary-search": "Binary Search",
  stacks: "Stacks",
  heaps: "Heaps",
  intervals: "Intervals",
  "prefix-sums": "Prefix Sums",
  trees: "Trees",
  tries: "Tries",
  graphs: "Graphs",
  backtracking: "Backtracking",
  "dynamic-programming": "Dynamic Programming",
  greedy: "Greedy",
  "sort-and-search": "Sort & Search",
  "bit-manipulation": "Bit Manipulation",
  "math-and-geometry": "Math & Geometry",
};

/**
 * Patterns and what must come before them. The scheduler walks this graph, so a
 * problem is never scheduled before the technique it depends on has appeared.
 */
export const PATTERN_PREREQS = {
  "array-traversal": [],
  "string-building": ["array-traversal"],
  "bit-tricks": [],
  math: [],
  sorting: ["array-traversal"],
  "hash-map": ["array-traversal"],
  "prefix-sum": ["array-traversal"],
  "two-pointers": ["array-traversal"],
  "sliding-window": ["two-pointers"],
  "monotonic-stack": ["array-traversal"],
  "binary-search": ["array-traversal"],
  "binary-search-on-answer": ["binary-search"],
  "fast-slow-pointers": ["two-pointers"],
  "tree-traversal": [],
  trie: ["tree-traversal"],
  bfs: ["tree-traversal"],
  dfs: ["tree-traversal"],
  heap: ["array-traversal"],
  backtracking: ["dfs"],
  "union-find": ["dfs"],
  "topological-sort": ["bfs"],
  greedy: ["array-traversal"],
  intervals: ["greedy"],
  "1d-dp": ["array-traversal"],
  "2d-dp": ["1d-dp"],
  knapsack: ["1d-dp"],
} as const satisfies Record<string, readonly string[]>;

export type PatternId = keyof typeof PATTERN_PREREQS;

export const PATTERN_LABELS: Record<PatternId, string> = {
  "array-traversal": "Array Traversal",
  "string-building": "String Building",
  "bit-tricks": "Bit Tricks",
  math: "Math",
  sorting: "Sorting",
  "hash-map": "Hash Map",
  "prefix-sum": "Prefix Sum",
  "two-pointers": "Two Pointers",
  "sliding-window": "Sliding Window",
  "monotonic-stack": "Monotonic Stack",
  "binary-search": "Binary Search",
  "binary-search-on-answer": "Binary Search on Answer",
  "fast-slow-pointers": "Fast & Slow Pointers",
  "tree-traversal": "Tree Traversal",
  trie: "Trie",
  bfs: "Breadth-First Search",
  dfs: "Depth-First Search",
  heap: "Heap",
  backtracking: "Backtracking",
  "union-find": "Union-Find",
  "topological-sort": "Topological Sort",
  greedy: "Greedy",
  intervals: "Intervals",
  "1d-dp": "1D Dynamic Programming",
  "2d-dp": "2D Dynamic Programming",
  knapsack: "Knapsack",
};

export type Problem = {
  /** Stable key for progress. Never renumber or reuse. */
  id: string;
  title: string;
  topic: TopicId;
  pattern: PatternId;
  difficulty: Difficulty;
  url: string;
  /** Expected solve time. The scheduler balances minutes, not problem counts. */
  minutes: number;
  prereqs: PatternId[];
};
