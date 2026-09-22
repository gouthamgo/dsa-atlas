import type { Lesson } from "./types";

export const foundationsLesson: Lesson = {
  topic: "foundations",
  subtitle: "Why reading any element is instant, and why inserting one is not.",
  whyInterviewer:
    "Half of all interview problems are arrays in disguise. Being able to say why reading is O(1) and a middle insert is O(n) is how you justify every complexity claim you make later.",
  idea:
    "Think of a row of numbered lockers in a hallway. To open locker 40 you **walk straight to it** — you never check lockers 1 to 39. But if someone wants a new locker squeezed in at number 2, **everyone from 2 onward has to shuffle down one**. Arrays are fast to read and slow to reshuffle, and almost every array trick is a way of avoiding the reshuffle.",
  figure: {
    title: "Reading is arithmetic; inserting is moving",
    frames: [
      {
        cells: [3, 8, 1, 9, 4],
        caption:
          "Five numbers, side by side in memory. Every slot is the same size, so slot i always lives at base + i × size.",
      },
      {
        cells: [3, 8, 1, 9, 4],
        pointers: [{ label: "arr[3]", at: 3, tone: "accent" }],
        marks: [{ at: 3, tone: "hit" }],
        readout: "address = base + 3 × 4 bytes",
        caption:
          "Reading arr[3] is one multiplication and one jump. It costs the same for the fifth element as for the five-millionth: O(1).",
      },
      {
        cells: [3, 8, 1, 9, 4, ""],
        pointers: [{ label: "insert 7 here", at: 1, tone: "warn" }],
        caption:
          "Now insert 7 at index 1. There is no gap to put it in, so everything from index 1 onward has to move right by one.",
      },
      {
        cells: [3, 8, 1, 9, "", 4],
        marks: [{ at: 5, tone: "move" }],
        readout: "moves: 1",
        caption: "Work from the back so nothing is overwritten. 4 moves into the new last slot.",
      },
      {
        cells: [3, 8, 1, "", 9, 4],
        marks: [{ at: 4, tone: "move" }],
        readout: "moves: 2",
        caption: "Then 9.",
      },
      {
        cells: [3, 8, "", 1, 9, 4],
        marks: [{ at: 3, tone: "move" }],
        readout: "moves: 3",
        caption: "Then 1.",
      },
      {
        cells: [3, "", 8, 1, 9, 4],
        marks: [{ at: 2, tone: "move" }],
        readout: "moves: 4",
        caption: "Then 8. Four moves to make room for one number — n moves in the worst case.",
      },
      {
        cells: [3, 7, 8, 1, 9, 4],
        marks: [{ at: 1, tone: "hit" }],
        readout: "insert in middle: O(n)",
        caption:
          "Finally 7 fits. Inserting in the middle is O(n); appending at the end is O(1), which is why stacks and queues work at the end.",
      },
    ],
  },
  code: {
    title: "One pass, one running value",
    python: `def max_profit(prices: list[int]) -> int:
    best, lowest = 0, float("inf")
    for p in prices:
        lowest = min(lowest, p)          # cheapest day so far
        best = max(best, p - lowest)     # what if I sold today?
    return best`,
    cpp: `int maxProfit(vector<int>& prices) {
    int best = 0, lowest = INT_MAX;
    for (int p : prices) {
        lowest = min(lowest, p);         // cheapest day so far
        best   = max(best, p - lowest);  // what if I sold today?
    }
    return best;
}`,
  },
  costs: [
    { op: "Read arr[i]", cost: "O(1)", note: "address arithmetic, no searching" },
    { op: "Search, unsorted", cost: "O(n)", note: "you have to look at each one" },
    { op: "Append at the end", cost: "O(1)*", note: "*amortised — vector occasionally doubles and copies" },
    { op: "Insert or delete in the middle", cost: "O(n)", note: "everything after it shifts" },
    { op: "Sort", cost: "O(n log n)", note: "often the step that unlocks two pointers" },
  ],
  traps: [
    "Off by one: `i <= n` reads one past the end. Loops over an array are `i < n`.",
    "Calling `push_back` while iterating the same vector can invalidate your iterators. Build a new vector instead.",
    "Summing large ints overflows silently. Use `long long` when values or counts can be big.",
    "Empty input. `prices[0]` on an empty vector is undefined behaviour — check the size first.",
  ],
};
