"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress, exportProgress, importProgress, type PlanLength } from "@/lib/store";

const LENGTHS: { value: PlanLength; label: string; hint: string }[] = [
  { value: 90, label: "90 days", hint: "intense — full-time study" },
  { value: 120, label: "120 days", hint: "balanced — fits around a job" },
  { value: 180, label: "180 days", hint: "steady — with room to revise" },
];

export default function SettingsPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const settings = useProgress((s) => s.settings);
  const setDays = useProgress((s) => s.setDays);
  const setStartDate = useProgress((s) => s.setStartDate);
  const reset = useProgress((s) => s.reset);

  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  if (!ready) return <div className="h-64" aria-hidden />;

  function download() {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dsa-atlas-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = importProgress(await file.text());
    setMessage(result.ok ? "Progress restored." : result.error);
    e.target.value = "";
  }

  return (
    <div className="max-w-[60ch] space-y-10">
      <h1 className="font-display text-3xl font-bold">Settings</h1>

      <section>
        <h2 className="font-display text-lg font-bold">Plan length</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Changing this rebuilds the schedule. Everything you have solved stays solved.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LENGTHS.map((l) => (
            <button
              key={l.value}
              onClick={() => setDays(l.value)}
              aria-pressed={settings.days === l.value}
              className={`rounded-lg border px-3 py-2 text-left text-sm ${
                settings.days === l.value
                  ? "border-[var(--mint)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              <div className="font-medium">{l.label}</div>
              <div className="text-xs opacity-70">{l.hint}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <label htmlFor="start" className="font-display text-lg font-bold">
          Start date
        </label>
        <p className="mt-1 text-sm text-[var(--muted)]">Day 1 of the plan.</p>
        <input
          id="start"
          type="date"
          value={settings.startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
        />
      </section>

      <section>
        <h2 className="font-display text-lg font-bold">Move your progress</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Progress lives in this browser only. Export it to carry it to another device.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={download}
            className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:border-[var(--mint)]"
          >
            Export file
          </button>
          <button
            onClick={() => fileInput.current?.click()}
            className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:border-[var(--mint)]"
          >
            Import file
          </button>
          <input ref={fileInput} type="file" accept="application/json" onChange={onFile} className="hidden" />
        </div>
        {message && <p className="mt-2 text-sm text-[var(--sand)]">{message}</p>}
      </section>

      <section>
        <h2 className="font-display text-lg font-bold">Start over</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Clears every solved problem, rating and note in this browser. Export first if you might want it back.
        </p>
        {confirmingReset ? (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                reset();
                setConfirmingReset(false);
                setMessage("Progress cleared.");
              }}
              className="rounded-lg px-3 py-2 text-sm"
              style={{ background: "var(--rose)", color: "#1b0808" }}
            >
              Yes, clear everything
            </button>
            <button
              onClick={() => setConfirmingReset(false)}
              className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
            >
              Keep my progress
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingReset(true)}
            className="mt-3 rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--rose)] hover:border-[var(--rose)]"
          >
            Clear progress
          </button>
        )}
      </section>
    </div>
  );
}
