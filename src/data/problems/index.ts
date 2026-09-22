import type { Problem } from "@/data/types";
import { twoPointers } from "./two-pointers";
import { hashMaps } from "./hash-maps";
import { linkedLists } from "./linked-lists";
import { fastSlowPointers } from "./fast-slow-pointers";
import { slidingWindows } from "./sliding-windows";
import { binarySearch } from "./binary-search";
import { stacks } from "./stacks";
import { heaps } from "./heaps";
import { intervals } from "./intervals";
import { prefixSums } from "./prefix-sums";
import { trees } from "./trees";
import { tries } from "./tries";
import { graphs } from "./graphs";
import { backtracking } from "./backtracking";
import { dynamicProgramming } from "./dynamic-programming";
import { greedy } from "./greedy";
import { sortAndSearch } from "./sort-and-search";
import { bitManipulation } from "./bit-manipulation";
import { mathAndGeometry } from "./math-and-geometry";

/** In the order of the book's chapters. */
export const ALL_PROBLEMS: Problem[] = [
  ...twoPointers,
  ...hashMaps,
  ...linkedLists,
  ...fastSlowPointers,
  ...slidingWindows,
  ...binarySearch,
  ...stacks,
  ...heaps,
  ...intervals,
  ...prefixSums,
  ...trees,
  ...tries,
  ...graphs,
  ...backtracking,
  ...dynamicProgramming,
  ...greedy,
  ...sortAndSearch,
  ...bitManipulation,
  ...mathAndGeometry,
];
