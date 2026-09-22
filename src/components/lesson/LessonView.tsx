import type { Lesson } from "@/data/lessons";
import { TOPIC_LABELS, TOPIC_ORDER } from "@/data/types";
import { StepFigure } from "./StepFigure";

/** Renders **phrase** as a highlighted span; everything else is plain text. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-medium text-[var(--mint)]">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Renders `code` spans in a sentence. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--ink)]">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-3 text-xl font-semibold text-[var(--ink)]">
        <span className="grid size-7 place-items-center rounded-md border border-[var(--line)] font-mono text-xs font-normal text-[var(--faint)]">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function LessonView({ lesson, problemCount }: { lesson: Lesson; problemCount: number }) {
  const position = TOPIC_ORDER.indexOf(lesson.topic) + 1;

  return (
    <article className="space-y-12">
      <header className="space-y-3">
        <p className="font-mono text-xs tracking-wider text-[var(--faint)]">
          LESSON {position} OF {TOPIC_ORDER.length} · {problemCount} PROBLEMS
        </p>
        <h1 className="text-4xl font-semibold text-[var(--ink)]">{TOPIC_LABELS[lesson.topic]}</h1>
        <p className="max-w-[62ch] text-lg text-[var(--muted)]">{lesson.subtitle}</p>
      </header>

      <aside className="flex gap-3 rounded-xl border border-[color-mix(in_srgb,var(--info)_45%,var(--line))] bg-[color-mix(in_srgb,var(--info)_10%,var(--surface))] p-4">
        <span aria-hidden className="mt-1 text-[var(--info)]">◆</span>
        <div>
          <p className="font-mono text-[11px] tracking-wider text-[var(--info)]">WHY AN INTERVIEWER CARES</p>
          <p className="mt-1 text-[15px] leading-relaxed text-[var(--soft)]">{lesson.whyInterviewer}</p>
        </div>
      </aside>

      <Step n={1} title="The idea, plainly">
        <p className="max-w-[62ch] border-l-2 border-[var(--mint)] pl-4 text-lg leading-relaxed text-[var(--soft)]">
          <Highlighted text={lesson.idea} />
        </p>
      </Step>

      <Step n={2} title="Watch it happen">
        <StepFigure title={lesson.figure.title} frames={lesson.figure.frames} />
        <p className="text-xs text-[var(--faint)]">Click the figure, then use ← and → to step.</p>
      </Step>

      <Step n={3} title={lesson.code.title}>
        <pre className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 font-mono text-[13px] leading-relaxed text-[var(--soft)]">
          <code>{lesson.code.source}</code>
        </pre>
      </Step>

      <Step n={4} title="What it costs">
        <div className="overflow-hidden rounded-xl border border-[var(--line)]">
          {lesson.costs.map((c) => (
            <div
              key={c.op}
              className="grid grid-cols-1 gap-1 border-b border-[var(--line)] px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_auto] sm:gap-4"
            >
              <div>
                <div className="text-[15px] text-[var(--ink)]">{c.op}</div>
                <div className="text-sm text-[var(--muted)]">{c.note}</div>
              </div>
              <div className="font-mono text-sm text-[var(--mint)] sm:text-right">{c.cost}</div>
            </div>
          ))}
        </div>
      </Step>

      <Step n={5} title="Where people slip">
        <ul className="space-y-3">
          {lesson.traps.map((t) => (
            <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-[var(--soft)]">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--rose)]" />
              <span>
                <Inline text={t} />
              </span>
            </li>
          ))}
        </ul>
      </Step>
    </article>
  );
}
