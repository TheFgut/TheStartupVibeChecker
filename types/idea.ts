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
  wordCount: number;
};

export type IdeaRecord = {
  id: string;
  concept: string;
  vibeScore: number;
  marketCategory: MarketCategory;
  createdAt: string;
};
