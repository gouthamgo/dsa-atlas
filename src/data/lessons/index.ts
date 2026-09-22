import type { Lesson, LessonId } from "./types";
import { foundationsLesson } from "./foundations";
import { twoPointersLesson } from "./two-pointers";
import { slidingWindowsLesson } from "./sliding-windows";

export const LESSONS: Partial<Record<LessonId, Lesson>> = {
  foundations: foundationsLesson,
  "two-pointers": twoPointersLesson,
  "sliding-windows": slidingWindowsLesson,
};

export const FOUNDATIONS_TITLE = "Foundations: arrays and cost";

export type { Lesson, LessonId, Frame } from "./types";
