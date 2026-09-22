import { TOPIC_ORDER, TOPIC_LABELS, type TopicId } from "@/data/types";
import { ALL_PROBLEMS } from "@/data/problems";
import { TopicList } from "./TopicList";

export function generateStaticParams() {
  return TOPIC_ORDER.map((topic) => ({ topic }));
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const id = topic as TopicId;
  const problems = ALL_PROBLEMS.filter((p) => p.topic === id);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{TOPIC_LABELS[id] ?? topic}</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">{problems.length} problems</p>
      <TopicList problems={problems} />
    </div>
  );
}
