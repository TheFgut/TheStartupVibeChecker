import { NextResponse } from "next/server";
import { createIdeaAnalysisJob, getIdeas } from "@/backend/ideas/idea-service";

type CreateIdeaRequest = {
  concept?: unknown;
};

export async function GET() {
  return NextResponse.json({
    ideas: getIdeas()
  });
}

export async function POST(request: Request) {
  let body: CreateIdeaRequest;

  try {
    body = (await request.json()) as CreateIdeaRequest;
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON payload."
      },
      { status: 400 }
    );
  }

  const concept = typeof body.concept === "string" ? body.concept.trim() : "";

  if (!concept) {
    return NextResponse.json(
      {
        error: "The 'concept' field is required."
      },
      { status: 400 }
    );
  }

  const job = createIdeaAnalysisJob(concept);

  return NextResponse.json(
    {
      job
    },
    { status: 202 }
  );
}
