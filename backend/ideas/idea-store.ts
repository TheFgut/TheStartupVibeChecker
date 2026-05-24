import type { AnalysisJob, AnalysisJobStatus, IdeaRecord } from "@/types/idea";

type StoredAnalysisJob = Omit<AnalysisJob, "progress" | "queuePosition">;

type IdeaStoreState = {
  activeJobId: string | null;
  ideas: IdeaRecord[];
  jobs: Map<string, StoredAnalysisJob>;
  queue: string[];
};

declare global {
  var __startupVibeCheckerStore: IdeaStoreState | undefined;
}

function getStore(): IdeaStoreState {
  if (!globalThis.__startupVibeCheckerStore) {
    globalThis.__startupVibeCheckerStore = {
      activeJobId: null,
      ideas: [],
      jobs: new Map<string, StoredAnalysisJob>(),
      queue: []
    };
  }

  return globalThis.__startupVibeCheckerStore;
}

export function listIdeas(): IdeaRecord[] {
  return [...getStore().ideas];
}

export function saveIdea(idea: IdeaRecord): IdeaRecord {
  getStore().ideas.unshift(idea);
  return idea;
}

export function addJob(job: StoredAnalysisJob): StoredAnalysisJob {
  const store = getStore();
  store.jobs.set(job.id, job);
  store.queue.push(job.id);
  return job;
}

export function getStoredJob(jobId: string): StoredAnalysisJob | null {
  return getStore().jobs.get(jobId) ?? null;
}

export function updateStoredJob(
  jobId: string,
  updater: (job: StoredAnalysisJob) => StoredAnalysisJob
): StoredAnalysisJob | null {
  const store = getStore();
  const existingJob = store.jobs.get(jobId);

  if (!existingJob) {
    return null;
  }

  const updatedJob = updater(existingJob);
  store.jobs.set(jobId, updatedJob);
  return updatedJob;
}

export function getNextQueuedJob(): StoredAnalysisJob | null {
  const store = getStore();

  if (store.activeJobId) {
    return null;
  }

  const nextJobId = store.queue.shift();

  if (!nextJobId) {
    return null;
  }

  const nextJob = store.jobs.get(nextJobId);

  if (!nextJob) {
    return getNextQueuedJob();
  }

  store.activeJobId = nextJobId;
  return nextJob;
}

export function clearActiveJob(jobId: string) {
  const store = getStore();

  if (store.activeJobId === jobId) {
    store.activeJobId = null;
  }
}

export function getQueuePosition(jobId: string): number | null {
  const store = getStore();
  const queueIndex = store.queue.indexOf(jobId);

  if (queueIndex === -1) {
    return null;
  }

  return queueIndex + 1;
}

export function toAnalysisJob(
  job: StoredAnalysisJob,
  statusOverride?: AnalysisJobStatus
): AnalysisJob {
  const status = statusOverride ?? job.status;

  return {
    ...job,
    progress: getJobProgress(job, status),
    queuePosition: status === "queued" ? getQueuePosition(job.id) : null,
    status
  };
}

function getJobProgress(job: StoredAnalysisJob, status: AnalysisJobStatus): number {
  if (status === "completed") {
    return 100;
  }

  if (status === "queued" || !job.startedAt) {
    return 0;
  }

  const elapsedMs = Date.now() - new Date(job.startedAt).getTime();
  const rawProgress = (elapsedMs / job.processingDurationMs) * 100;

  return Math.max(2, Math.min(96, Math.round(rawProgress)));
}
