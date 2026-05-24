import type { IdeaRecord } from "@/types/idea";

const ideas: IdeaRecord[] = [];

export function listIdeas(): IdeaRecord[] {
  return ideas;
}

export function saveIdea(idea: IdeaRecord): IdeaRecord {
  ideas.unshift(idea);
  return idea;
}
