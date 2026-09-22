import type { Problem } from "@/data/types";
import { arrays } from "./arrays";
import { hashing } from "./hashing";
import { twoPointers } from "./two-pointers";

export const ALL_PROBLEMS: Problem[] = [...arrays, ...hashing, ...twoPointers];
