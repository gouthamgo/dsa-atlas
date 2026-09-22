import type { Lesson } from "./types";

export const twoPointersLesson: Lesson = {
  topic: "two-pointers",
  subtitle: "Two indices walking toward each other, so an O(n²) search becomes O(n).",
  whyInterviewer:
    "It's the standard answer to \"can you do better than O(n²)?\", and the step past hashing when the interviewer adds \"now with O(1) extra space\".",
  idea:
    "Two people searching a sorted bookshelf from opposite ends. After every comparison, **one of them steps inward knowing they have ruled that book out forever**. Nobody ever walks back, so between them they cross the shelf once.",
  figure: {
    title: "Find two numbers that add to 10",
    frames: [
      {
        cells: [1, 3, 4, 6, 8, 11],
        pointers: [
          { label: "L", at: 0, tone: "accent" },
          { label: "R", at: 5, tone: "accent" },
        ],
        readout: "1 + 11 = 12",
        caption: "The numbers are sorted. Put one pointer at each end and add them.",
      },
      {
        cells: [1, 3, 4, 6, 8, 11],
        pointers: [
          { label: "L", at: 0, tone: "accent" },
          { label: "R", at: 4, tone: "accent" },
        ],
        marks: [{ at: 5, tone: "dim" }],
        readout: "12 > 10, so R moves left",
        caption:
          "Too big. 11 was paired with the smallest number available and was still too big, so it can never be in the answer. R moves left.",
      },
      {
        cells: [1, 3, 4, 6, 8, 11],
        pointers: [
          { label: "L", at: 0, tone: "accent" },
          { label: "R", at: 4, tone: "accent" },
        ],
        marks: [{ at: 5, tone: "dim" }],
        readout: "1 + 8 = 9",
        caption: "Now 9 — too small. The only way up is a bigger left number.",
      },
      {
        cells: [1, 3, 4, 6, 8, 11],
        pointers: [
          { label: "L", at: 1, tone: "accent" },
          { label: "R", at: 4, tone: "accent" },
        ],
        marks: [
          { at: 0, tone: "dim" },
          { at: 5, tone: "dim" },
        ],
        readout: "3 + 8 = 11",
        caption: "L steps right, and 1 is ruled out for the same reason 11 was. Now 11 — too big again.",
      },
      {
        cells: [1, 3, 4, 6, 8, 11],
        pointers: [
          { label: "L", at: 1, tone: "accent" },
          { label: "R", at: 3, tone: "accent" },
        ],
        marks: [
          { at: 0, tone: "dim" },
          { at: 4, tone: "dim" },
          { at: 5, tone: "dim" },
        ],
        readout: "3 + 6 = 9",
        caption: "R steps left. 9, too small.",
      },
      {
        cells: [1, 3, 4, 6, 8, 11],
        pointers: [
          { label: "L", at: 2, tone: "accent" },
          { label: "R", at: 3, tone: "accent" },
        ],
        marks: [
          { at: 0, tone: "dim" },
          { at: 1, tone: "dim" },
          { at: 2, tone: "hit" },
          { at: 3, tone: "hit" },
          { at: 4, tone: "dim" },
          { at: 5, tone: "dim" },
        ],
        readout: "4 + 6 = 10 ✓",
        caption:
          "Found it. Every step retired one number for good, so the search takes at most n steps: O(n) time and no extra memory.",
      },
    ],
  },
  code: {
    title: "Two Sum II, the template",
    python: `def two_sum(a: list[int], target: int) -> list[int]:
    l, r = 0, len(a) - 1
    while l < r:
        total = a[l] + a[r]
        if total == target:
            return [l + 1, r + 1]
        if total < target:
            l += 1      # need bigger: left moves up
        else:
            r -= 1      # need smaller: right moves down
    return []`,
    cpp: `vector<int> twoSum(vector<int>& a, int target) {
    int l = 0, r = a.size() - 1;
    while (l < r) {
        int sum = a[l] + a[r];
        if (sum == target) return {l + 1, r + 1};
        if (sum < target) l++;   // need bigger: left moves up
        else              r--;   // need smaller: right moves down
    }
    return {};
}`,
  },
  costs: [
    { op: "Pair search, sorted input", cost: "O(n) · O(1) space", note: "each step retires one element" },
    { op: "Brute force, every pair", cost: "O(n²)", note: "what two pointers replaces" },
    { op: "Hash map instead", cost: "O(n) · O(n) space", note: "works unsorted, but costs memory" },
    { op: "Input not sorted", cost: "+ O(n log n)", note: "sort first, then this is still the fastest step" },
  ],
  traps: [
    "`while (l <= r)` lets an element pair with itself. Pairs need `l < r`.",
    "It only works because the input is sorted. On unsorted data, sort first or use a hash map.",
    "3Sum and 4Sum return duplicates unless you skip equal values after a match.",
    "`a[l] + a[r]` can overflow an int when values are near the limits.",
  ],
};
