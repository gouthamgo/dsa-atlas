import type { TopicId } from "@/data/types";
import type { Lesson } from "./types";
import { arraysLesson } from "./arrays";
import { twoPointersLesson } from "./two-pointers";
import { slidingWindowLesson } from "./sliding-window";

export const LESSONS: Partial<Record<TopicId, Lesson>> = {
  arrays: arraysLesson,
  "two-pointers": twoPointersLesson,
  "sliding-window": slidingWindowLesson,
};

export type { Lesson, Frame } from "./types";
