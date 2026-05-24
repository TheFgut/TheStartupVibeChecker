"use client";

import { useState } from "react";
import { ArrowRight, LockKeyhole, Orbit } from "lucide-react";

type IdeaFormProps = {
  isLocked: boolean;
  onSubmit: (concept: string) => Promise<void>;
};

export function IdeaForm({ isLocked, onSubmit }: IdeaFormProps) {
  const [concept, setConcept] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedConcept = concept.trim();

    if (!trimmedConcept) {
      setLocalError("Enter a startup concept before running the vibe check.");
      return;
    }

    setLocalError(null);
    await onSubmit(trimmedConcept);
  }

  return (
    <form
      className="space-y-4 rounded-[1.75rem] border border-stone-900/10 bg-stone-950 p-4 text-white shadow-[0_18px_60px_rgba(28,25,23,0.25)]"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-stone-200" htmlFor="concept">
            Startup concept
          </label>
          {isLocked ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-stone-300">
              <LockKeyhole className="h-3.5 w-3.5" />
              Locked during analysis
            </span>
          ) : null}
        </div>
        <textarea
          id="concept"
          name="concept"
          className="min-h-36 w-full resize-none rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition placeholder:text-stone-500 focus:border-amber-300 focus:bg-white/10 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/[0.03] disabled:text-stone-400"
          disabled={isLocked}
          onChange={(event) => setConcept(event.target.value)}
          placeholder="Example: AI copilot for independent dental clinics that automates follow-ups, billing reminders, and treatment plan education."
          value={concept}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-stone-400">
          Queue-based analysis. Longer pitches take longer on the server.
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-stone-600 disabled:text-stone-300"
          disabled={isLocked}
          type="submit"
        >
          {isLocked ? (
            <>
              <Orbit className="h-4 w-4 animate-spin [animation-duration:2.4s]" />
              In analysis queue
            </>
          ) : (
            <>
              Analyze idea
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {localError ? <p className="text-sm text-red-300">{localError}</p> : null}

      {isLocked ? (
        <p className="text-sm leading-6 text-stone-400">
          The current pitch stays locked until the backend finishes the simulated
          analysis job.
        </p>
      ) : null}
    </form>
  );
}
