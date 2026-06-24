import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/db/property.repository", () => ({
  findPropertyByCode: vi.fn(),
}));

vi.mock("@/lib/ai/generate-experience-guide", () => ({
  getOrCreateExperienceGuide: vi.fn(),
}));

import { findPropertyByCode } from "@/lib/db/property.repository";
import { getOrCreateExperienceGuide } from "@/lib/ai/generate-experience-guide";

const mockFindProperty = vi.mocked(findPropertyByCode);
const mockGetOrCreate = vi.mocked(getOrCreateExperienceGuide);

const MOCK_PROPERTY = { id: "prop-1", code: "FLN001" } as Parameters<typeof getOrCreateExperienceGuide>[0];

const MOCK_GUIDE = {
  welcome_message: "Bem-vindo!",
  restaurants: [],
  attractions: [],
  essentials: [],
  seasonal_tip: "Verão ótimo.",
};

function makeRequest(code = "FLN001") {
  return new Request(`http://test/api/properties/${code}/experience-guide`);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/properties/[code]/experience-guide", () => {
  it("returns 404 when property is not found", async () => {
    mockFindProperty.mockResolvedValue(null);

    const res = await GET(makeRequest(), { params: Promise.resolve({ code: "FLN001" }) });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: "Imóvel não encontrado" });
  });

  it("returns 200 with guide when property is found", async () => {
    mockFindProperty.mockResolvedValue(MOCK_PROPERTY);
    mockGetOrCreate.mockResolvedValue(MOCK_GUIDE);

    const res = await GET(makeRequest(), { params: Promise.resolve({ code: "FLN001" }) });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(MOCK_GUIDE);
    expect(mockGetOrCreate).toHaveBeenCalledWith(MOCK_PROPERTY);
  });

  it("returns 502 when getOrCreateExperienceGuide throws", async () => {
    mockFindProperty.mockResolvedValue(MOCK_PROPERTY);
    mockGetOrCreate.mockRejectedValue(new Error("AI failure"));

    const res = await GET(makeRequest(), { params: Promise.resolve({ code: "FLN001" }) });

    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body).toEqual({ error: "Falha ao gerar o guia. Tente novamente." });
  });
});
