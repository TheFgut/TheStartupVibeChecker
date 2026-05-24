/**
 * @vitest-environment node
 */

import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { GET as getIdeasRoute, POST as postIdeasRoute } from "@/app/api/ideas/route";
import { GET as getIdeaJobRoute } from "@/app/api/ideas/jobs/[jobId]/route";
import { resetIdeaStore } from "@/backend/ideas/idea-store";

describe("ideas API routes", () => {
  beforeEach(() => {
    resetIdeaStore();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetIdeaStore();
  });

  it("queues an idea, completes analysis, and publishes it to history", async () => {
    const concept =
      "AI clinic workflow platform for dental teams with money popular best viral automation";

    const createResponse = await postIdeasRoute(
      new Request("http://localhost:3000/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ concept })
      })
    );

    expect(createResponse.status).toBe(202);

    const createBody = (await createResponse.json()) as {
      job: {
        id: string;
        status: string;
        processingDurationMs: number;
      };
    };

    expect(createBody.job.id).toBeTruthy();
    expect(["queued", "processing"]).toContain(createBody.job.status);

    const beforeIdeasResponse = await getIdeasRoute();
    const beforeIdeasBody = (await beforeIdeasResponse.json()) as {
      ideas: Array<unknown>;
    };

    expect(beforeIdeasBody.ideas).toHaveLength(0);

    await vi.advanceTimersByTimeAsync(createBody.job.processingDurationMs + 10);

    const jobStatusResponse = await getIdeaJobRoute(new Request("http://localhost"), {
      params: Promise.resolve({
        jobId: createBody.job.id
      })
    });

    expect(jobStatusResponse.status).toBe(200);

    const jobStatusBody = (await jobStatusResponse.json()) as {
      job: {
        status: string;
        progress: number;
        idea: {
          concept: string;
          vibeScore: number;
          marketCategory: string;
        } | null;
      };
    };

    expect(jobStatusBody.job.status).toBe("completed");
    expect(jobStatusBody.job.progress).toBe(100);
    expect(jobStatusBody.job.idea?.concept).toBe(concept);
    expect(jobStatusBody.job.idea?.vibeScore).toBeGreaterThanOrEqual(1);
    expect(jobStatusBody.job.idea?.vibeScore).toBeLessThanOrEqual(10);
    expect(jobStatusBody.job.idea?.marketCategory).toBe("AI Tools");

    const afterIdeasResponse = await getIdeasRoute();
    const afterIdeasBody = (await afterIdeasResponse.json()) as {
      ideas: Array<{
        concept: string;
      }>;
    };

    expect(afterIdeasBody.ideas).toHaveLength(1);
    expect(afterIdeasBody.ideas[0]?.concept).toBe(concept);
  });
});
