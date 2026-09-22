"use client";

import { useEffect, useState } from "react";

type Lang = "python" | "cpp";
const KEY = "dsa-atlas-code-lang";
const LABELS: Record<Lang, string> = { python: "Python", cpp: "C++" };

/** Python and C++ side by side as tabs; the choice sticks across lessons. */
export function CodeTabs({ python, cpp }: { python: string; cpp: string }) {
  const [lang, setLang] = useState<Lang>("python");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "python" || saved === "cpp") setLang(saved);
    } catch {
      /* private mode: default stays */
    }
  }, []);

  function choose(next: Lang) {
    setLang(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* not remembered this session */
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]">
      <div role="tablist" aria-label="Code language" className="flex gap-1 border-b border-[var(--line)] px-2 py-1.5">
        {(Object.keys(LABELS) as Lang[]).map((l) => (
          <button
            key={l}
            role="tab"
            aria-selected={lang === l}
            onClick={() => choose(l)}
            className={`rounded-md px-3 py-1 font-mono text-xs transition-colors ${
              lang === l ? "bg-[var(--surface-2)] text-[var(--ink)]" : "text-[var(--faint)] hover:text-[var(--soft)]"
            }`}
          >
            {LABELS[l]}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-[var(--soft)]">
        <code>{lang === "python" ? python : cpp}</code>
      </pre>
    </div>
  );
}
