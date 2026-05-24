"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Rocket, Send, Sparkles } from "lucide-react";
import type { IdeaRecord } from "@/types/idea";
import { IdeaForm } from "@/frontend/dashboard/idea-form";
import { IdeaHistory } from "@/frontend/dashboard/idea-history";

type IdeasResponse = {
  ideas: IdeaRecord[];
};

type CreateIdeaResponse = {
  idea: IdeaRecord;
};

export function VibeDashboard() {
  const [ideas, setIdeas] = useState<IdeaRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadIdeas() {
      try {
        const response = await fetch("/api/ideas", {
          method: "GET",
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Failed to load idea history.");
        }

        const data = (await response.json()) as IdeasResponse;
        setIdeas(data.ideas);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load idea history."
        );
      } finally {
        setIsLoadingHistory(false);
      }
    }

    void loadIdeas();
  }, []);

  async function handleIdeaSubmit(concept: string) {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ concept })
      });

      const data = (await response.json()) as CreateIdeaResponse | { error: string };

      if (!response.ok || !("idea" in data)) {
        throw new Error("error" in data ? data.error : "Failed to analyze the idea.");
      }

      setIdeas((currentIdeas) => [data.idea, ...currentIdeas]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to analyze the idea."
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(253,224,71,0.22),_transparent_28%),linear-gradient(135deg,_#f5f1e8_0%,_#f7d9a3_48%,_#d5e7df_100%)] px-4 py-10 text-stone-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-stone-900/10 bg-white/75 p-6 shadow-[0_24px_80px_rgba(32,20,6,0.12)] backdrop-blur md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-100/70 px-3 py-1 text-sm font-medium text-amber-900">
                <Sparkles className="h-4 w-4" />
                Simulated AI founder triage
              </div>

              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
                  Startup Vibe Checker
                </h1>
                <p className="max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
                  Drop in a startup pitch and get an instant vibe score with a market
                  category. The dashboard keeps the latest concepts in memory so you
                  can compare what deserves a second look.
                </p>
              </div>

              <IdeaForm isSubmitting={isSubmitting} onSubmit={handleIdeaSubmit} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.75rem] bg-stone-950 p-6 text-stone-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.28em] text-stone-400">
                    Total Pitches
                  </span>
                  <Rocket className="h-5 w-5 text-amber-300" />
                </div>
                <p className="mt-6 text-5xl font-semibold tracking-[-0.05em]">
                  {ideas.length}
                </p>
                <p className="mt-3 text-sm text-stone-400">
                  In-memory history of startup ideas analyzed during this session.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-stone-900/10 bg-white/70 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.28em] text-stone-500">
                    Status
                  </span>
                  {isSubmitting ? (
                    <LoaderCircle className="h-5 w-5 animate-spin text-stone-700" />
                  ) : (
                    <Send className="h-5 w-5 text-stone-700" />
                  )}
                </div>
                <p className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
                  {isSubmitting ? "Analyzing concept..." : "Ready for the next pitch"}
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {isSubmitting
                    ? "The backend is scoring the current concept and assigning a market category."
                    : "Submit a concise pitch to generate a score from 1 to 10 and save it to history."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {errorMessage ? (
          <section className="rounded-[1.5rem] border border-red-300/70 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-[0_12px_40px_rgba(127,29,29,0.08)]">
            {errorMessage}
          </section>
        ) : null}

        <IdeaHistory ideas={ideas} isLoading={isLoadingHistory} />
      </div>
    </main>
  );
}
