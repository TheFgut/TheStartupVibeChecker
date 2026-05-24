import { CheckCircle2, Clock3, LoaderCircle, Radar } from "lucide-react";
import type { AnalysisJob } from "@/types/idea";

type AnalysisStatusPanelProps = {
  activeJob: AnalysisJob | null;
  displayProgress: number;
  isLoadingHistory: boolean;
};

export function AnalysisStatusPanel({
  activeJob,
  displayProgress,
  isLoadingHistory
}: AnalysisStatusPanelProps) {
  const roundedProgress = Math.round(displayProgress);
  const isAnalyzing = activeJob !== null;
  const isCompleted = activeJob?.status === "completed";
  const showProgressRing = isAnalyzing && !isCompleted;
  const statusLabel = getStatusLabel(activeJob, isLoadingHistory);
  const statusBody = getStatusBody(activeJob, roundedProgress, isLoadingHistory);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-stone-900/10 bg-white/70 p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <div className="flex items-center justify-between">
        <span className="text-sm uppercase tracking-[0.28em] text-stone-500">
          Status
        </span>
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        ) : isAnalyzing ? (
          <Radar className="h-5 w-5 animate-spin text-stone-700 [animation-duration:2.8s]" />
        ) : isLoadingHistory ? (
          <LoaderCircle className="h-5 w-5 animate-spin text-stone-700" />
        ) : (
          <Clock3 className="h-5 w-5 text-stone-700" />
        )}
      </div>

      <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:items-center">
        <div
          aria-hidden={!showProgressRing}
          className={`flex justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] xl:justify-start ${
            showProgressRing
              ? "max-h-44 opacity-100 translate-y-0 xl:w-40 xl:min-w-40 xl:max-w-40 xl:translate-x-0"
              : "max-h-0 opacity-0 -translate-y-2 xl:w-0 xl:min-w-0 xl:max-w-0 xl:-translate-x-3 xl:translate-y-0"
          }`}
        >
          <ProgressRing progress={roundedProgress} />
        </div>

        <div
          className={`min-w-0 space-y-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            showProgressRing ? "max-w-none xl:translate-x-0" : "max-w-xl"
          }`}
        >
          <p className="text-2xl font-semibold tracking-[-0.04em]">{statusLabel}</p>
          <p className="text-sm leading-6 text-stone-600">{statusBody}</p>

          {activeJob ? (
            <div className="grid gap-2 text-sm text-stone-500 sm:grid-cols-2">
              <div className="rounded-2xl bg-stone-100/80 px-4 py-3">
                Queue position:{" "}
                <span className="font-semibold text-stone-800">
                  {activeJob.queuePosition ?? 0}
                </span>
              </div>
              <div className="rounded-2xl bg-stone-100/80 px-4 py-3">
                Server ETA:{" "}
                <span className="font-semibold text-stone-800">
                  {formatEta(activeJob.processingDurationMs)}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type ProgressRingProps = {
  progress: number;
};

function ProgressRing({ progress }: ProgressRingProps) {
  const normalizedRadius = 52;
  const circumference = 2 * Math.PI * normalizedRadius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative mx-auto h-40 w-40 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <div className="absolute inset-1 animate-spin rounded-full border border-dashed border-amber-300/70 [animation-duration:4s]" />
      <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,_rgba(251,191,36,0.22),_transparent_68%)]" />

      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
        <circle
          className="stroke-stone-200"
          cx="60"
          cy="60"
          fill="transparent"
          r={normalizedRadius}
          strokeWidth="10"
        />
        <circle
          className="stroke-stone-950 transition-[stroke-dashoffset] duration-300 ease-out"
          cx="60"
          cy="60"
          fill="transparent"
          r={normalizedRadius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-semibold tracking-[-0.05em] text-stone-950">
          {progress}%
        </span>
        <span className="mt-1 text-xs uppercase tracking-[0.28em] text-stone-500">
          Analyzing
        </span>
      </div>
    </div>
  );
}

function getStatusLabel(activeJob: AnalysisJob | null, isLoadingHistory: boolean) {
  if (activeJob?.status === "queued") {
    return "Queued for analysis";
  }

  if (activeJob?.status === "processing") {
    return "Analyzing concept";
  }

  if (activeJob?.status === "completed") {
    return "Analysis published";
  }

  if (isLoadingHistory) {
    return "Loading dashboard";
  }

  return "Ready for the next pitch";
}

function getStatusBody(
  activeJob: AnalysisJob | null,
  progress: number,
  isLoadingHistory: boolean
) {
  if (activeJob?.status === "queued") {
    return `The pitch is waiting its turn on the backend queue. Progress starts once the server begins the simulated AI pass.`;
  }

  if (activeJob?.status === "processing") {
    return `The server is processing the current pitch. The ring fills as progress updates arrive from the backend job tracker.`;
  }

  if (activeJob?.status === "completed") {
    if (progress < 100) {
      return "The backend has finished the analysis. The progress ring is catching up before the dashboard unlocks the next submission.";
    }

    return "The analyzed pitch has been published to the shared history and the dashboard is about to unlock for the next submission.";
  }

  if (isLoadingHistory) {
    return "Loading completed startup ideas from the shared session history.";
  }

  return "Submit a startup idea to enqueue a server-side analysis job and watch the progress in real time.";
}

function formatEta(durationMs: number) {
  const seconds = Math.max(1, Math.round(durationMs / 1000));
  return `${seconds}s`;
}
