import { ALL_PROBLEMS } from "@/data/problems";
import { ProblemDetail } from "./ProblemDetail";

export function generateStaticParams() {
  return ALL_PROBLEMS.map((p) => ({ id: p.id }));
}

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = ALL_PROBLEMS.find((p) => p.id === id);

  if (!problem) {
    return <p className="text-sm text-[var(--muted)]">That problem is not in the curriculum.</p>;
  }

  return <ProblemDetail problem={problem} />;
}
