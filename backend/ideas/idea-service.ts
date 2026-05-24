import {
  addJob,
  clearActiveJob,
  getNextQueuedJob,
  getStoredJob,
  listIdeas,
  saveIdea,
  toAnalysisJob,
  updateStoredJob
} from "@/backend/ideas/idea-store";
import {
  analyzeConcept,
  estimateAnalysisDurationMs
} from "@/backend/ideas/vibe-analysis";
import type { AnalysisJob, IdeaRecord } from "@/types/idea";

export function getIdeas(): IdeaRecord[] {
  return listIdeas();
}

export function createIdeaAnalysisJob(concept: string): AnalysisJob {
  const job = addJob({
    id: crypto.randomUUID(),
    concept,
    status: "queued",
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
    processingDurationMs: estimateAnalysisDurationMs(concept),
    idea: null
  });

  startNextJobIfIdle();

  return getAnalysisJob(job.id) ?? toAnalysisJob(job);
}

export function getAnalysisJob(jobId: string): AnalysisJob | null {
  const job = getStoredJob(jobId);

  if (!job) {
    return null;
  }

  return toAnalysisJob(job);
}

function startNextJobIfIdle() {
  const nextJob = getNextQueuedJob();

  if (!nextJob) {
    return;
  }

  const startedJob = updateStoredJob(nextJob.id, (job) => ({
    ...job,
    status: "processing",
    startedAt: new Date().toISOString()
  }));

  if (!startedJob) {
    clearActiveJob(nextJob.id);
    startNextJobIfIdle();
    return;
  }

  setTimeout(() => {
    completeIdeaAnalysisJob(startedJob.id);
  }, startedJob.processingDurationMs);
}

function completeIdeaAnalysisJob(jobId: string) {
  const completedJob = updateStoredJob(jobId, (job) => {
    const analysis = analyzeConcept(job.concept);
    const analyzedIdea = saveIdea({
      id: crypto.randomUUID(),
      concept: job.concept,
      vibeScore: analysis.vibeScore,
      marketCategory: analysis.marketCategory,
      createdAt: new Date().toISOString()
    });

    return {
      ...job,
      status: "completed",
      completedAt: new Date().toISOString(),
      idea: analyzedIdea
    };
  });

  if (!completedJob) {
    clearActiveJob(jobId);
    startNextJobIfIdle();
    return;
  }

  clearActiveJob(completedJob.id);
  startNextJobIfIdle();
}
