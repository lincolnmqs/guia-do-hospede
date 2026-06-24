import { describe, it, expect, vi, beforeEach } from "vitest";

const findGuide = vi.fn();
const saveGuide = vi.fn();
const generateContent = vi.fn();

vi.mock("@/lib/db/experience-guide.repository", () => ({
  findGuideByPropertyId: (...a: any) => findGuide(...a),
  saveGuide: (...a: any) => saveGuide(...a),
}));
vi.mock("./generate-content", () => ({ generateExperienceGuideContent: (...a: any) => generateContent(...a) }));

import { getOrCreateExperienceGuide } from "./generate-experience-guide";

const property: any = { id: "p1", code: "FLN001" };
const content = { welcome_message: "x", restaurants: [], attractions: [], essentials: [], seasonal_tip: "y" };

describe("getOrCreateExperienceGuide", () => {
  beforeEach(() => vi.clearAllMocks());
  it("returns persisted guide without calling the model", async () => {
    findGuide.mockResolvedValue({ welcomeMessage: "x", restaurants: [], attractions: [], essentials: [], seasonalTip: "y" });
    await getOrCreateExperienceGuide(property);
    expect(generateContent).not.toHaveBeenCalled();
    expect(saveGuide).not.toHaveBeenCalled();
  });
  it("generates and persists exactly once when absent", async () => {
    findGuide.mockResolvedValue(null);
    generateContent.mockResolvedValue(content);
    await getOrCreateExperienceGuide(property);
    expect(generateContent).toHaveBeenCalledTimes(1);
    expect(saveGuide).toHaveBeenCalledTimes(1);
  });
});
