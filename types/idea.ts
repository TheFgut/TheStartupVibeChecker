export type MarketCategory =
  | "AI Tools"
  | "Fintech"
  | "Healthtech"
  | "E-commerce"
  | "Developer Tools"
  | "Marketplace"
  | "Consumer"
  | "General SaaS";

export type VibeAnalysis = {
  vibeScore: number;
  marketCategory: MarketCategory;
  potentialTier: PotentialTier;
  wordCount: number;
};

export type PotentialTier = "Low Potential" | "Medium Potential" | "High Potential";

export type AnalysisJobStatus = "queued" | "processing" | "completed";

export type IdeaRecord = {
  id: string;
  concept: string;
  vibeScore: number;
  marketCategory: MarketCategory;
  createdAt: string;
};

export type AnalysisJob = {
  id: string;
  concept: string;
  status: AnalysisJobStatus;
  progress: number;
  queuePosition: number | null;
  processingDurationMs: number;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  idea: IdeaRecord | null;
};
