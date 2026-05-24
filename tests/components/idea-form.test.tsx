import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IdeaForm } from "@/frontend/dashboard/idea-form";

describe("IdeaForm", () => {
  it("validates empty input and submits a trimmed concept", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<IdeaForm isLocked={false} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Analyze idea" }));

    expect(
      screen.getByText("Enter a startup concept before running the vibe check.")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Startup concept"), {
      target: {
        value: "  AI dental workflow copilot  "
      }
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze idea" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("AI dental workflow copilot");
    });
  });

  it("locks the form while analysis is in progress", () => {
    render(<IdeaForm isLocked={true} onSubmit={vi.fn()} />);

    expect(screen.getByText("Locked during analysis")).toBeInTheDocument();
    expect(screen.getByLabelText("Startup concept")).toBeDisabled();
    expect(screen.getByRole("button", { name: /In analysis queue/i })).toBeDisabled();
  });
});
