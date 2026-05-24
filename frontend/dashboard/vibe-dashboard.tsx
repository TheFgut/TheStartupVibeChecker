"use client";

import { useEffect, useState } from "react";
import { Rocket, Sparkles } from "lucide-react";
import { IdeaForm } from "@/frontend/dashboard/idea-form";
import { IdeaHistory } from "@/frontend/dashboard/idea-history";
import { AnalysisStatusPanel } from "@/frontend/dashboard/analysis-status-panel";
import type { AnalysisJob, IdeaRecord } from "@/types/idea";

type IdeasResponse = {
  ideas: IdeaRecord[];
};

type CreateIdeaJobResponse = {
  job: AnalysisJob;
};

type AnalysisJobResponse = {
  job: AnalysisJob;
};

const HISTORY_POLL_INTERVAL_MS = 4000;
const JOB_POLL_INTERVAL_MS = 700;
const STATUS_RESET_DELAY_MS = 450;

export function VibeDashboard() {
  const [ideas, setIdeas] = useState<IdeaRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [activeJob, setActiveJob] = useState<AnalysisJob | null>(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);

  async function refreshIdeas() {
    try {
      const nextIdeas = await fetchIdeas();
      setIdeas(nextIdeas);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load idea history."
      );
    }
  }

  async function pollActiveJob(jobId: string) {
    try {
      const nextJob = await fetchIdeaJob(jobId);
      setActiveJob(nextJob);

      if (nextJob.status === "completed") {
        const nextIdeas = await fetchIdeas();
        setIdeas(nextIdeas);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to refresh analysis status."
      );
    }
  }

  async function handleIdeaSubmit(concept: string) {
    setErrorMessage(null);
    setDisplayProgress(0);

    try {
      const createdJob = await createIdeaJob(concept);
      setActiveJob(createdJob);

      if (createdJob.status === "completed") {
        const nextIdeas = await fetchIdeas();
        setIdeas(nextIdeas);
      }
    } catch (error) {
      setActiveJob(null);
      setDisplayProgress(0);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to enqueue the idea."
      );
      throw error;
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialIdeas() {
      try {
        const nextIdeas = await fetchIdeas();

        if (isMounted) {
          setIdeas(nextIdeas);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to load idea history."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingHistory(false);
        }
      }
    }

    void loadInitialIdeas();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void refreshIdeas();
    }, HISTORY_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!activeJob || activeJob.status === "completed") {
      return;
    }

    const intervalId = window.setInterval(() => {
      void pollActiveJob(activeJob.id);
    }, JOB_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeJob]);

  useEffect(() => {
    if (!activeJob) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setDisplayProgress((currentProgress) => {
        const targetProgress =
          activeJob.status === "completed"
            ? 100
            : Math.max(activeJob.progress, currentProgress);

        if (Math.abs(targetProgress - currentProgress) < 0.5) {
          return targetProgress;
        }

        const step =
          activeJob.status === "completed"
            ? Math.max(1.8, (targetProgress - currentProgress) * 0.18)
            : Math.max(0.4, (targetProgress - currentProgress) * 0.08);

        return Math.min(targetProgress, currentProgress + step);
      });
    }, 40);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeJob]);

  useEffect(() => {
    if (!activeJob || activeJob.status !== "completed" || displayProgress < 100) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setActiveJob(null);
      setDisplayProgress(0);
      setFormResetKey((currentValue) => currentValue + 1);
    }, STATUS_RESET_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeJob, displayProgress]);

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
                  Submit a startup pitch into the analysis queue, watch the live
                  progress, and publish results to the shared history only after the
                  backend finishes the simulated AI pass.
                </p>
              </div>

              <IdeaForm
                key={formResetKey}
                isLocked={activeJob !== null}
                onSubmit={handleIdeaSubmit}
              />
            </div>

            <div className="grid gap-4 lg:grid-rows-[auto_1fr]">
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
                  Completed analyses visible to every connected session after the
                  server finishes processing.
                </p>
              </div>

              <AnalysisStatusPanel
                activeJob={activeJob}
                displayProgress={displayProgress}
                isLoadingHistory={isLoadingHistory}
              />
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

async function fetchIdeas(): Promise<IdeaRecord[]> {
  const response = await fetch("/api/ideas", {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to load idea history.");
  }

  const data = (await response.json()) as IdeasResponse;
  return data.ideas;
}

async function createIdeaJob(concept: string): Promise<AnalysisJob> {
  const response = await fetch("/api/ideas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ concept })
  });

  const data = (await response.json()) as CreateIdeaJobResponse | { error: string };

  if (!response.ok || !("job" in data)) {
    throw new Error("error" in data ? data.error : "Failed to enqueue the idea.");
  }

  return data.job;
}

async function fetchIdeaJob(jobId: string): Promise<AnalysisJob> {
  const response = await fetch(`/api/ideas/jobs/${jobId}`, {
    method: "GET",
    cache: "no-store"
  });

  const data = (await response.json()) as AnalysisJobResponse | { error: string };

  if (!response.ok || !("job" in data)) {
    throw new Error(
      "error" in data ? data.error : "Failed to refresh analysis status."
    );
  }

  return data.job;
}
