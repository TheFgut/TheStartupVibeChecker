import { BarChart3, LoaderCircle } from "lucide-react";
import type { IdeaRecord } from "@/types/idea";

type IdeaHistoryProps = {
  ideas: IdeaRecord[];
  isLoading: boolean;
};

export function IdeaHistory({ ideas, isLoading }: IdeaHistoryProps) {
  return (
    <section className="rounded-[2rem] border border-stone-900/10 bg-white/75 p-6 shadow-[0_24px_80px_rgba(32,20,6,0.12)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-3 border-b border-stone-900/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-stone-500">
            Submission History
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            Recent startup ideas
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-3 py-1.5 text-sm text-stone-50">
          <BarChart3 className="h-4 w-4 text-amber-300" />
          Live session feed
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-52 items-center justify-center gap-3 text-stone-600">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading ideas...
        </div>
      ) : ideas.length === 0 ? (
        <div className="flex min-h-52 items-center justify-center rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50/60 text-center text-stone-500">
          No ideas yet. Submit the first pitch to start the history.
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {ideas.map((idea) => (
            <article
              key={idea.id}
              className="grid gap-4 rounded-[1.5rem] border border-stone-900/10 bg-stone-50/80 p-5 lg:grid-cols-[1fr_auto]"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-50">
                    {idea.marketCategory}
                  </span>
                  <span className="text-sm text-stone-500">
                    {formatIdeaDate(idea.createdAt)}
                  </span>
                </div>
                <p className="text-base leading-7 text-stone-800">{idea.concept}</p>
              </div>

              <div className="flex items-start lg:justify-end">
                <div className="min-w-36 rounded-[1.25rem] bg-white px-4 py-3 text-center shadow-[0_12px_32px_rgba(28,25,23,0.08)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                    Vibe Score
                  </p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-stone-950">
                    {idea.vibeScore}
                  </p>
                  <p className="mt-2 text-sm text-stone-500">out of 10</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatIdeaDate(createdAt: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(createdAt));
}
