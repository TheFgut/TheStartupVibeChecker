import { NextResponse } from "next/server";
import { getAnalysisJob } from "@/backend/ideas/idea-service";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { jobId } = await context.params;
  const job = getAnalysisJob(jobId);

  if (!job) {
    return NextResponse.json(
      {
        error: "Analysis job not found."
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    job
  });
}
