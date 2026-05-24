import type { MarketCategory, VibeAnalysis } from "@/types/idea";

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
  const words = normalizedConcept.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  return {
    vibeScore: Math.min(10, Math.max(1, wordCount)),
    marketCategory: detectMarketCategory(normalizedConcept),
    wordCount
  };
}

function detectMarketCategory(concept: string): MarketCategory {
  for (const entry of CATEGORY_KEYWORDS) {
    if (entry.keywords.some((keyword) => concept.includes(keyword))) {
      return entry.category;
    }
  }

  return "General SaaS";
}
