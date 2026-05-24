import { NextResponse } from "next/server";
import { createIdea, getIdeas } from "@/backend/ideas/idea-service";

type CreateIdeaRequest = {
  concept?: unknown;
};

export async function GET() {
  return NextResponse.json({
    ideas: getIdeas()
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateIdeaRequest;
  const concept = typeof body.concept === "string" ? body.concept.trim() : "";

  if (!concept) {
    return NextResponse.json(
      {
        error: "The 'concept' field is required."
      },
      { status: 400 }
    );
  }

  const idea = createIdea(concept);

  return NextResponse.json(
    {
      idea
    },
    { status: 201 }
  );
}
