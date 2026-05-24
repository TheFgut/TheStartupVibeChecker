import { analyzeConcept } from "@/backend/ideas/vibe-analysis";
import { listIdeas, saveIdea } from "@/backend/ideas/idea-store";
import type { IdeaRecord } from "@/types/idea";

export function getIdeas(): IdeaRecord[] {
  return listIdeas();
}

export function createIdea(concept: string): IdeaRecord {
  const analysis = analyzeConcept(concept);

  const idea: IdeaRecord = {
    id: crypto.randomUUID(),
    concept,
    vibeScore: analysis.vibeScore,
    marketCategory: analysis.marketCategory,
    createdAt: new Date().toISOString()
  };

  return saveIdea(idea);
}
