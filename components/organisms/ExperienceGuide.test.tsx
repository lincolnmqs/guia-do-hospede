import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ExperienceGuide } from "./ExperienceGuide";
import type { ExperienceGuideContent } from "@/lib/schemas/experience-guide";

/* ─── Shared fixture ─────────────────────────────────────────────────────── */
const guideFixture: ExperienceGuideContent = {
  welcome_message: "Bem-vindo ao Paraíso! Aqui estão nossas dicas.",
  restaurants: [
    { name: "Box 32", distance: "1,2 km", description: "petiscos" },
    { name: "Mar e Sol", distance: "2,0 km", description: "frutos do mar" },
    { name: "Churrascão", distance: "3,0 km", description: "churrasco" },
    { name: "Pizzaria Brisa", distance: "1,8 km", description: "pizzas" },
  ],
  attractions: [
    { name: "Praia do Forte", distance: "0,5 km", description: "praia tranquila" },
    { name: "Mirante da Serra", distance: "4,0 km", description: "vista panorâmica" },
    { name: "Museu Histórico", distance: "2,5 km", description: "história local" },
  ],
  essentials: [
    { name: "Farmácia Popular", distance: "1,0 km", description: "24 horas", type: "farmácia" },
  ],
  seasonal_tip: "O verão é ideal para mergulho!",
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function makePendingFetch() {
  return vi.fn(() => new Promise<Response>(() => { /* never resolves */ }));
}

function makeSuccessFetch(data: ExperienceGuideContent) {
  return vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => data,
    } as unknown as Response),
  );
}

function makeErrorFetch(status: number, errorBody: object) {
  return vi.fn(() =>
    Promise.resolve({
      ok: false,
      status,
      json: async () => errorBody,
    } as unknown as Response),
  );
}

/* ─── Tests ──────────────────────────────────────────────────────────────── */
describe("ExperienceGuide", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the loading skeleton while fetch is pending", () => {
    global.fetch = makePendingFetch();

    render(<ExperienceGuide code="SEA001" />);

    expect(screen.getByTestId("experience-guide-skeleton")).toBeInTheDocument();
  });

  it("renders restaurant name once fetch resolves with 200", async () => {
    global.fetch = makeSuccessFetch(guideFixture);

    render(<ExperienceGuide code="SEA001" />);

    expect(await screen.findByText("Box 32")).toBeInTheDocument();
  });

  it("shows error state and retry button on non-ok response; clicking retry triggers a second fetch", async () => {
    const mockFetch = makeErrorFetch(502, { error: "Serviço temporariamente indisponível." });
    global.fetch = mockFetch;

    render(<ExperienceGuide code="SEA001" />);

    // Wait for error state to appear
    const retryButton = await screen.findByRole("button", { name: /tentar novamente/i });
    expect(retryButton).toBeInTheDocument();

    // An error message text should be visible somewhere in the component
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Clicking retry should trigger a second fetch call
    const user = userEvent.setup();
    await user.click(retryButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
