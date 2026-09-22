import Link from "next/link";
import { TOPIC_ORDER, TOPIC_LABELS, type TopicId } from "@/data/types";
import { ALL_PROBLEMS } from "@/data/problems";
import { LESSONS, type LessonId } from "@/data/lessons";
import { LessonView } from "@/components/lesson/LessonView";
import { TopicList } from "./TopicList";

export function generateStaticParams() {
  return [{ topic: "foundations" }, ...TOPIC_ORDER.map((topic) => ({ topic }))];
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const id = topic as TopicId;
  const problems = ALL_PROBLEMS.filter((p) => p.topic === id);
  const lesson = LESSONS[topic as LessonId];
  const index = TOPIC_ORDER.indexOf(id);
  // Foundations leads into chapter 1; each chapter leads into the next.
  const next = topic === "foundations" ? TOPIC_ORDER[0] : TOPIC_ORDER[index + 1];

  return (
    <div className="mx-auto max-w-3xl space-y-14">
      {lesson ? (
        <LessonView lesson={lesson} problemCount={problems.length} />
      ) : (
        <header>
          <h1 className="text-4xl font-semibold">{TOPIC_LABELS[id] ?? topic}</h1>
          <p className="mt-2 text-[var(--muted)]">
            The lesson for this topic is still being written. The problems are ready below.
          </p>
        </header>
      )}

      {problems.length > 0 && (
      <section>
        <h2 className="flex items-center gap-3 text-xl font-semibold">
          <span className="grid size-7 place-items-center rounded-md border border-[var(--line)] font-mono text-xs font-normal text-[var(--faint)]">
            {lesson ? 6 : 1}
          </span>
          Now practise it
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {problems.length} problems, easiest first. Your plan schedules them for you — this is the whole set.
        </p>
        <TopicList problems={problems} />
      </section>
      )}

      {next && (
        <Link
          href={`/topics/${next}`}
          className="flex items-center justify-between rounded-xl border border-[var(--line)] p-4 transition-colors hover:border-[var(--line-strong)]"
        >
          <span className="text-sm text-[var(--muted)]">Next chapter</span>
          <span className="font-medium">{TOPIC_LABELS[next]} →</span>
        </Link>
      )}
    </div>
  );
}
