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

  it("handles P2002 race: saveGuide rejects with P2002, re-reads and returns the winner's row", async () => {
    const raceRow = {
      welcomeMessage: "x",
      restaurants: [],
      attractions: [],
      essentials: [],
      seasonalTip: "y",
    };

    // First findGuide returns null (both racers see empty DB)
    // Second findGuide returns the winner's row
    findGuide
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(raceRow);

    generateContent.mockResolvedValue(content);

    // saveGuide rejects with a P2002-like error
    const p2002 = Object.assign(new Error("Unique constraint failed"), { code: "P2002" });
    saveGuide.mockRejectedValue(p2002);

    const result = await getOrCreateExperienceGuide(property);

    expect(result).toEqual(content); // rowToContent(raceRow) === content fixture
    expect(generateContent).toHaveBeenCalledTimes(1);
    expect(saveGuide).toHaveBeenCalledTimes(1);
    expect(findGuide).toHaveBeenCalledTimes(2);
  });
});
