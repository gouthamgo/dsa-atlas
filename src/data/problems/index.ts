import type { Problem } from "@/data/types";
import { arrays } from "./arrays";
import { hashing } from "./hashing";
import { twoPointers } from "./two-pointers";
import { slidingWindow } from "./sliding-window";
import { stacks } from "./stacks";
import { binarySearch } from "./binary-search";
import { linkedLists } from "./linked-lists";
import { trees } from "./trees";
import { heaps } from "./heaps";
import { backtracking } from "./backtracking";
import { graphs } from "./graphs";
import { greedy } from "./greedy";
import { dynamicProgramming } from "./dynamic-programming";

export const ALL_PROBLEMS: Problem[] = [
  ...arrays,
  ...hashing,
  ...twoPointers,
  ...slidingWindow,
  ...stacks,
  ...binarySearch,
  ...linkedLists,
  ...trees,
  ...heaps,
  ...backtracking,
  ...graphs,
  ...greedy,
  ...dynamicProgramming,
];
