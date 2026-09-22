export type Difficulty = "easy" | "medium" | "hard";

export const TOPIC_ORDER = [
  "arrays",
  "strings",
  "hashing",
  "two-pointers",
  "sliding-window",
  "stacks",
  "binary-search",
  "linked-lists",
  "trees",
  "heaps",
  "backtracking",
  "graphs",
  "greedy",
  "bit-manipulation",
  "dynamic-programming",
] as const;

export type TopicId = (typeof TOPIC_ORDER)[number];

export const TOPIC_LABELS: Record<TopicId, string> = {
  arrays: "Arrays",
  strings: "Strings",
  hashing: "Hashing",
  "two-pointers": "Two Pointers",
  "sliding-window": "Sliding Window",
  stacks: "Stacks & Queues",
  "binary-search": "Binary Search",
  "linked-lists": "Linked Lists",
  trees: "Trees",
  heaps: "Heaps",
  backtracking: "Backtracking",
  graphs: "Graphs",
  greedy: "Greedy",
  "bit-manipulation": "Bit Manipulation",
  "dynamic-programming": "Dynamic Programming",
};

/**
 * Patterns and what must come before them. The scheduler walks this graph, so a
 * problem is never scheduled before the technique it depends on has appeared.
 */
export const PATTERN_PREREQS = {
  "array-traversal": [],
  "string-building": ["array-traversal"],
  "bit-tricks": [],
  "hash-map": ["array-traversal"],
  "prefix-sum": ["array-traversal"],
  "two-pointers": ["array-traversal"],
  "sliding-window": ["two-pointers"],
  "monotonic-stack": ["array-traversal"],
  "binary-search": ["array-traversal"],
  "binary-search-on-answer": ["binary-search"],
  "fast-slow-pointers": ["two-pointers"],
  "tree-traversal": [],
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
  "hash-map": "Hash Map",
  "prefix-sum": "Prefix Sum",
  "two-pointers": "Two Pointers",
  "sliding-window": "Sliding Window",
  "monotonic-stack": "Monotonic Stack",
  "binary-search": "Binary Search",
  "binary-search-on-answer": "Binary Search on Answer",
  "fast-slow-pointers": "Fast & Slow Pointers",
  "tree-traversal": "Tree Traversal",
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
