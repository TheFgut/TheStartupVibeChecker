"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

type IdeaFormProps = {
  isSubmitting: boolean;
  onSubmit: (concept: string) => Promise<void>;
};

export function IdeaForm({ isSubmitting, onSubmit }: IdeaFormProps) {
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
    setConcept("");
  }

  return (
    <form
      className="space-y-4 rounded-[1.75rem] border border-stone-900/10 bg-stone-950 p-4 text-white shadow-[0_18px_60px_rgba(28,25,23,0.25)]"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-200" htmlFor="concept">
          Startup concept
        </label>
        <textarea
          id="concept"
          name="concept"
          className="min-h-36 w-full resize-none rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition placeholder:text-stone-500 focus:border-amber-300 focus:bg-white/10"
          disabled={isSubmitting}
          onChange={(event) => setConcept(event.target.value)}
          placeholder="Example: AI copilot for independent dental clinics that automates follow-ups, billing reminders, and treatment plan education."
          value={concept}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-stone-400">
          The current backend scores by word count, capped at 10.
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-stone-600 disabled:text-stone-300"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Running vibe check
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
    </form>
  );
}
