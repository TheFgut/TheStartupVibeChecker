import type { MarketCategory, PotentialTier, VibeAnalysis } from "@/types/idea";

const MAX_WORD_SCORE = 5;
const WORDS_PER_POINT = 5;
const VIBE_KEYWORDS = [
  "money",
  "popular",
  "best",
  "we will be rich",
  "viral"
] as const;

const CATEGORY_KEYWORDS: Array<{
  category: MarketCategory;
  keywords: string[];
}> = [
  {
    category: "AI Tools",
    keywords: ["ai", "agent", "llm", "automation", "copilot"]
  },
  {
    category: "Fintech",
    keywords: ["fintech", "payments", "banking", "invoice", "finance"]
  },
  {
    category: "Healthtech",
    keywords: ["health", "medical", "clinic", "patient", "wellness"]
  },
  {
    category: "E-commerce",
    keywords: ["shop", "store", "commerce", "retail", "checkout"]
  },
  {
    category: "Developer Tools",
    keywords: ["developer", "api", "sdk", "devtool", "engineering"]
  },
  {
    category: "Marketplace",
    keywords: ["marketplace", "buyers", "sellers", "supply", "demand"]
  },
  {
    category: "Consumer",
    keywords: ["consumer", "social", "creator", "community", "mobile"]
  }
];

export function analyzeConcept(concept: string): VibeAnalysis {
  const normalizedConcept = concept.trim().toLowerCase();
  const wordCount = countConceptWords(normalizedConcept);
  const wordScore = getWordScore(wordCount);
  const keywordScore = getKeywordScore(normalizedConcept);
  const vibeScore = Math.max(1, Math.min(10, wordScore + keywordScore));

  return {
    vibeScore,
    marketCategory: detectMarketCategory(normalizedConcept),
    potentialTier: getPotentialTier(vibeScore),
    wordCount
  };
}

export function countConceptWords(concept: string): number {
  return concept.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateAnalysisDurationMs(concept: string): number {
  const wordCount = countConceptWords(concept);
  return Math.min(14000, 2200 + wordCount * 220);
}

export function getPotentialTier(vibeScore: number): PotentialTier {
  if (vibeScore >= 8) {
    return "High Potential";
  }

  if (vibeScore >= 4) {
    return "Medium Potential";
  }

  return "Low Potential";
}

function getWordScore(wordCount: number): number {
  return Math.min(MAX_WORD_SCORE, Math.floor(wordCount / WORDS_PER_POINT));
}

function getKeywordScore(concept: string): number {
  const matchedKeywords = VIBE_KEYWORDS.filter((keyword) => concept.includes(keyword));
  return Math.min(MAX_WORD_SCORE, matchedKeywords.length);
}

function detectMarketCategory(concept: string): MarketCategory {
  for (const entry of CATEGORY_KEYWORDS) {
    if (entry.keywords.some((keyword) => concept.includes(keyword))) {
      return entry.category;
    }
  }

  return "General SaaS";
}
