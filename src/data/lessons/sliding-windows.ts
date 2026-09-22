import type { Lesson } from "./types";

const s = ["a", "b", "c", "a", "b", "c", "b", "b"];

export const slidingWindowsLesson: Lesson = {
  topic: "sliding-windows",
  subtitle: "A range that grows at the front and shrinks at the back, never moving backwards.",
  whyInterviewer:
    "\"Longest\", \"shortest\", \"at most k\", \"contiguous\" — those words mean sliding window. Interviewers use it to check you can turn an O(n²) scan of every substring into one O(n) pass.",
  idea:
    "Picture a **caterpillar crawling along a line**. Its head stretches forward to take in something new. When it swallows something it shouldn't, **the tail pulls up** until the body is fine again. Neither end ever crawls backwards, and that is the whole trick.",
  figure: {
    title: "Longest run with no repeated letter",
    frames: [
      {
        cells: s,
        pointers: [{ label: "L R", at: 0, tone: "accent" }],
        window: [0, 0],
        readout: "window {a} · best 1",
        caption: "Start with a window of one letter. It has no repeats, so it's valid.",
      },
      {
        cells: s,
        pointers: [
          { label: "L", at: 0, tone: "accent" },
          { label: "R", at: 1, tone: "accent" },
        ],
        window: [0, 1],
        readout: "window {a,b} · best 2",
        caption: "R stretches forward. b is new, so the window stays valid.",
      },
      {
        cells: s,
        pointers: [
          { label: "L", at: 0, tone: "accent" },
          { label: "R", at: 2, tone: "accent" },
        ],
        window: [0, 2],
        readout: "window {a,b,c} · best 3",
        caption: "c is new too. Best so far: 3.",
      },
      {
        cells: s,
        pointers: [
          { label: "L", at: 0, tone: "accent" },
          { label: "R", at: 3, tone: "warn" },
        ],
        window: [0, 3],
        marks: [
          { at: 0, tone: "move" },
          { at: 3, tone: "move" },
        ],
        readout: "a is already at 0",
        caption: "R reaches a second a. Now the window has a repeat and is no longer valid.",
      },
      {
        cells: s,
        pointers: [
          { label: "L", at: 1, tone: "accent" },
          { label: "R", at: 3, tone: "accent" },
        ],
        window: [1, 3],
        marks: [{ at: 0, tone: "dim" }],
        readout: "window {b,c,a} · best 3",
        caption: "L jumps past the old a. Nothing gets checked twice: L only ever moves forward.",
      },
      {
        cells: s,
        pointers: [
          { label: "L", at: 2, tone: "accent" },
          { label: "R", at: 4, tone: "accent" },
        ],
        window: [2, 4],
        marks: [
          { at: 0, tone: "dim" },
          { at: 1, tone: "dim" },
        ],
        readout: "window {c,a,b} · best 3",
        caption: "b repeats the b at index 1, so L jumps to 2.",
      },
      {
        cells: s,
        pointers: [
          { label: "L", at: 3, tone: "accent" },
          { label: "R", at: 5, tone: "accent" },
        ],
        window: [3, 5],
        marks: [0, 1, 2].map((at) => ({ at, tone: "dim" as const })),
        readout: "window {a,b,c} · best 3",
        caption: "c repeats the c at 2, so L jumps to 3.",
      },
      {
        cells: s,
        pointers: [
          { label: "L", at: 5, tone: "accent" },
          { label: "R", at: 6, tone: "accent" },
        ],
        window: [5, 6],
        marks: [0, 1, 2, 3, 4].map((at) => ({ at, tone: "dim" as const })),
        readout: "window {c,b} · best 3",
        caption: "b repeats the b at 4, so L jumps to 5 and the window shrinks to two.",
      },
      {
        cells: s,
        pointers: [{ label: "L R", at: 7, tone: "accent" }],
        window: [7, 7],
        marks: [0, 1, 2, 3, 4, 5, 6].map((at) => ({ at, tone: "dim" as const })),
        readout: "answer: 3",
        caption:
          "Done. Every letter entered the window once and left once, so it's O(n) even though it looks like a loop inside a loop.",
      },
    ],
  },
  code: {
    title: "Longest substring without repeats",
    python: `def length_of_longest_substring(s: str) -> int:
    last = {}                       # where each char was last seen
    best = left = 0
    for right, c in enumerate(s):
        if last.get(c, -1) >= left:  # repeat inside the window?
            left = last[c] + 1       # tail jumps past it
        last[c] = right
        best = max(best, right - left + 1)
    return best`,
    cpp: `int lengthOfLongestSubstring(string s) {
    vector<int> last(128, -1);           // where each char was last seen
    int best = 0, left = 0;
    for (int right = 0; right < s.size(); right++) {
        if (last[s[right]] >= left)       // repeat inside the window?
            left = last[s[right]] + 1;    // tail jumps past it
        last[s[right]] = right;
        best = max(best, right - left + 1);
    }
    return best;
}`,
  },
  costs: [
    { op: "Variable window", cost: "O(n)", note: "each index enters once and leaves once" },
    { op: "Fixed window of size k", cost: "O(n)", note: "add the new end, drop the old start" },
    { op: "Brute force, every substring", cost: "O(n²) or worse", note: "what the window replaces" },
    { op: "Extra space", cost: "O(k)", note: "a map or array sized to the alphabet" },
  ],
  traps: [
    "Letting L move backwards. Only jump if the old position is inside the window: `last[c] >= left`.",
    "Window length is `right - left + 1`, not `right - left`.",
    "Count-based windows need `while` to shrink, not `if` — one step may not be enough.",
    "Clearing the map when the window breaks. Shrink it; don't restart it.",
  ],
};
