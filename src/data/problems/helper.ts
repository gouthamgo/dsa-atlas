import type { Difficulty, PatternId, Problem, TopicId } from "@/data/types";

/** One line per problem: mk(topic)(id, title, pattern, difficulty, minutes, prereqs). */
export const mk =
  (topic: TopicId) =>
  (
    id: string,
    title: string,
    pattern: PatternId,
    difficulty: Difficulty,
    minutes: number,
    prereqs: PatternId[] = [],
  ): Problem => ({
    id,
    title,
    topic,
    pattern,
    difficulty,
    url: `https://leetcode.com/problems/${id}/`,
    minutes,
    prereqs,
  });
