import type { PatternId } from "@/data/types";

export type PatternGuide = {
  /** The signal in a problem statement that this pattern applies. */
  tell: string;
  /** What stays true on every iteration. Knowing this is knowing the pattern. */
  invariant: string;
  example: { title: string; code: string };
  complexity: string;
};

export const PATTERN_GUIDES: Record<PatternId, PatternGuide> = {
  "array-traversal": {
    tell: "One pass over the input answers the question, and you only need a running value.",
    invariant: "After index i, your accumulator holds the answer for the prefix ending at i.",
    example: {
      title: "Best time to buy and sell stock",
      code: `let best = 0, min = prices[0];
for (const p of prices) {
  min = Math.min(min, p);
  best = Math.max(best, p - min);
}`,
    },
    complexity: "O(n) time, O(1) space.",
  },
  "hash-map": {
    tell: "You need to ask 'have I seen this before?' or 'how many of these are there?' in O(1).",
    invariant: "The map always describes exactly the part of the input you have already scanned.",
    example: {
      title: "Two sum",
      code: `const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  const need = target - nums[i];
  if (seen.has(need)) return [seen.get(need), i];
  seen.set(nums[i], i);
}`,
    },
    complexity: "O(n) time, O(n) space.",
  },
  "prefix-sum": {
    tell: "Many range queries, or counting subarrays whose sum has a property.",
    invariant: "prefix[i] is the sum of everything before i, so any range is a subtraction.",
    example: {
      title: "Subarray sum equals k",
      code: `const count = new Map([[0, 1]]);
let sum = 0, total = 0;
for (const n of nums) {
  sum += n;
  total += count.get(sum - k) ?? 0;
  count.set(sum, (count.get(sum) ?? 0) + 1);
}`,
    },
    complexity: "O(n) time, O(n) space.",
  },
  "two-pointers": {
    tell: "The array is sorted, or you compare elements from both ends inward.",
    invariant: "Everything outside the two pointers has already been decided and never needs revisiting.",
    example: {
      title: "Container with most water",
      code: `let l = 0, r = h.length - 1, best = 0;
while (l < r) {
  best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
  if (h[l] < h[r]) l++; else r--;
}`,
    },
    complexity: "O(n) time, O(1) space.",
  },
  "sliding-window": {
    tell: "Longest or shortest contiguous run satisfying a condition.",
    invariant: "The window between left and right is always valid, or is being shrunk until it is.",
    example: {
      title: "Longest substring without repeating characters",
      code: `const last = new Map();
let left = 0, best = 0;
for (let r = 0; r < s.length; r++) {
  if (last.has(s[r]) && last.get(s[r]) >= left) left = last.get(s[r]) + 1;
  last.set(s[r], r);
  best = Math.max(best, r - left + 1);
}`,
    },
    complexity: "O(n) time — each index enters and leaves the window once.",
  },
  "monotonic-stack": {
    tell: "'Next greater', 'previous smaller', or a span bounded by taller neighbours.",
    invariant: "The stack stays sorted, so popping finds the boundary you were waiting for.",
    example: {
      title: "Next greater element",
      code: `const stack = [], out = Array(nums.length).fill(-1);
for (let i = 0; i < nums.length; i++) {
  while (stack.length && nums[stack.at(-1)] < nums[i]) out[stack.pop()] = nums[i];
  stack.push(i);
}`,
    },
    complexity: "O(n) time — every index is pushed and popped once.",
  },
  "binary-search": {
    tell: "Sorted input, and each comparison can discard half of what is left.",
    invariant: "The answer, if it exists, is always inside [lo, hi].",
    example: {
      title: "Classic search",
      code: `let lo = 0, hi = a.length - 1;
while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  if (a[mid] === t) return mid;
  if (a[mid] < t) lo = mid + 1; else hi = mid - 1;
}`,
    },
    complexity: "O(log n) time.",
  },
  "binary-search-on-answer": {
    tell: "'Minimum capacity', 'smallest k such that…' where a guess is easy to verify.",
    invariant: "feasible(x) is false up to some threshold and true after it; you search for that edge.",
    example: {
      title: "Minimum eating speed",
      code: `let lo = 1, hi = Math.max(...piles);
while (lo < hi) {
  const mid = (lo + hi) >> 1;
  if (hoursNeeded(mid) <= h) hi = mid; else lo = mid + 1;
}
return lo;`,
    },
    complexity: "O(n log range) time.",
  },
  "fast-slow-pointers": {
    tell: "Cycle detection, or finding the middle of a list in one pass.",
    invariant: "Fast moves two steps per slow step, so it gains one position per iteration.",
    example: {
      title: "Linked list cycle",
      code: `let slow = head, fast = head;
while (fast?.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) return true;
}`,
    },
    complexity: "O(n) time, O(1) space.",
  },
  "tree-traversal": {
    tell: "Anything that visits every node: sums, depths, validation.",
    invariant: "A node is handled only after the children its answer depends on.",
    example: {
      title: "Max depth",
      code: `const depth = (node) => node ? 1 + Math.max(depth(node.left), depth(node.right)) : 0;`,
    },
    complexity: "O(n) time, O(h) stack.",
  },
  bfs: {
    tell: "Shortest path in an unweighted graph, or level-by-level work.",
    invariant: "Everything in the queue is at distance d or d+1 from the start — never further.",
    example: {
      title: "Level order",
      code: `const q = [root], out = [];
while (q.length) {
  const level = q.splice(0, q.length);
  out.push(level.map((n) => n.val));
  for (const n of level) for (const c of [n.left, n.right]) if (c) q.push(c);
}`,
    },
    complexity: "O(V + E) time.",
  },
  dfs: {
    tell: "Explore one branch fully before the next: connected components, flood fill, paths.",
    invariant: "A visited node is never entered twice, so the recursion terminates.",
    example: {
      title: "Number of islands",
      code: `const sink = (r, c) => {
  if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== "1") return;
  grid[r][c] = "0";
  sink(r+1,c); sink(r-1,c); sink(r,c+1); sink(r,c-1);
};`,
    },
    complexity: "O(V + E) time.",
  },
  heap: {
    tell: "'Top k', 'k largest', or a running median.",
    invariant: "The heap holds exactly the k best seen so far, worst element on top.",
    example: {
      title: "K largest",
      code: `const heap = new MinHeap();
for (const n of nums) {
  heap.push(n);
  if (heap.size > k) heap.pop();
}`,
    },
    complexity: "O(n log k) time, O(k) space.",
  },
  backtracking: {
    tell: "Generate every combination, permutation or subset under constraints.",
    invariant: "The partial solution is always valid; you undo the last choice before trying the next.",
    example: {
      title: "Subsets",
      code: `const walk = (i, cur) => {
  if (i === nums.length) return out.push([...cur]);
  walk(i + 1, cur);
  cur.push(nums[i]);
  walk(i + 1, cur);
  cur.pop();
};`,
    },
    complexity: "O(2^n) subsets, O(n!) permutations.",
  },
  "union-find": {
    tell: "Repeatedly merge groups and ask whether two things are already connected.",
    invariant: "Every element points toward its set's root; merging is a single pointer change.",
    example: {
      title: "Find with path compression",
      code: `const find = (x) => parent[x] === x ? x : (parent[x] = find(parent[x]));
const union = (a, b) => { parent[find(a)] = find(b); };`,
    },
    complexity: "Near O(1) per operation.",
  },
  "topological-sort": {
    tell: "Ordering with dependencies: course schedules, build order, cycle detection in a DAG.",
    invariant: "A node is emitted only once every prerequisite has been emitted.",
    example: {
      title: "Kahn's algorithm",
      code: `const q = nodes.filter((n) => indegree[n] === 0);
while (q.length) {
  const n = q.shift();
  order.push(n);
  for (const m of adj[n]) if (--indegree[m] === 0) q.push(m);
}`,
    },
    complexity: "O(V + E) time.",
  },
  greedy: {
    tell: "A local choice is provably safe — usually after sorting.",
    invariant: "Taking the best option now never rules out an optimal finish.",
    example: {
      title: "Jump game",
      code: `let reach = 0;
for (let i = 0; i < nums.length; i++) {
  if (i > reach) return false;
  reach = Math.max(reach, i + nums[i]);
}`,
    },
    complexity: "O(n) time after an O(n log n) sort, when sorting is needed.",
  },
  intervals: {
    tell: "Start and end pairs: merging, overlap counting, meeting rooms.",
    invariant: "After sorting by start, only the last kept interval can overlap the next one.",
    example: {
      title: "Merge intervals",
      code: `intervals.sort((a, b) => a[0] - b[0]);
for (const [s, e] of intervals) {
  const last = out.at(-1);
  if (last && s <= last[1]) last[1] = Math.max(last[1], e);
  else out.push([s, e]);
}`,
    },
    complexity: "O(n log n) time.",
  },
  "1d-dp": {
    tell: "Count the ways, or the best value, where the answer builds on the previous step or two.",
    invariant: "dp[i] is the answer for the first i elements and never changes once written.",
    example: {
      title: "House robber",
      code: `let prev = 0, cur = 0;
for (const n of nums) {
  [prev, cur] = [cur, Math.max(cur, prev + n)];
}`,
    },
    complexity: "O(n) time, O(1) space when only the last states matter.",
  },
  "2d-dp": {
    tell: "Two sequences compared, or a grid walked: edit distance, LCS, unique paths.",
    invariant: "dp[i][j] answers the subproblem for the first i of one input and first j of the other.",
    example: {
      title: "Longest common subsequence",
      code: `for (let i = 1; i <= a.length; i++)
  for (let j = 1; j <= b.length; j++)
    dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);`,
    },
    complexity: "O(n·m) time and space, often reducible to one row.",
  },
  knapsack: {
    tell: "Choose items under a budget or capacity, each taken once or many times.",
    invariant: "dp[c] is the best value achievable with exactly capacity c considered so far.",
    example: {
      title: "0/1 knapsack",
      code: `for (const { w, v } of items)
  for (let c = cap; c >= w; c--)
    dp[c] = Math.max(dp[c], dp[c - w] + v);`,
    },
    complexity: "O(n·capacity) time. Iterate capacity downward for 0/1, upward for unbounded.",
  },
};
