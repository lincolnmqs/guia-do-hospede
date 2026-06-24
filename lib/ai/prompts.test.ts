import { describe, it, expect } from "vitest";
import { buildChatSystemPrompt, buildExperienceGuidePrompt } from "./prompts";
import { amenityLabel } from "../format";

const property: any = {
  code: "FLN001", name: "Apartamento Beira-Mar Florianópolis", propertyType: "Apartamento",
  operational: { wifiNetwork: "SeaHome_FLN001", wifiPassword: "floripa2024" },
  rules: { allowPet: false, checkInTime: "15:00", checkOutTime: "11:00" },
  address: { city: "Florianópolis", state: "SC", neighborhood: "Trindade" },
  host: { name: "Ana Paula", phone: "+5548991234567" },
};
const guide: any = { restaurants: [{ name: "Box 32", distance: "1,2 km", description: "petiscos" }] };

describe("buildChatSystemPrompt", () => {
  const p = buildChatSystemPrompt(property, guide);
  it("includes wifi credentials", () => {
    expect(p).toContain("SeaHome_FLN001");
    expect(p).toContain("floripa2024");
  });
  it("includes pet policy and check-in time", () => {
    expect(p).toMatch(/15:00/);
    expect(p.toLowerCase()).toMatch(/pet|animal/);
  });
  it("includes nearby restaurant from the guide", () => {
    expect(p).toContain("Box 32");
  });
  it("instructs not to invent information", () => {
    expect(p.toLowerCase()).toMatch(/não invente|não inventar|apenas.*dados|somente.*dados/);
  });
});

describe("amenityLabel", () => {
  it("returns PT-BR label for known key", () => {
    expect(amenityLabel("air_conditioning")).toBe("Ar-condicionado");
    expect(amenityLabel("wifi")).toBe("WiFi");
    expect(amenityLabel("pool")).toBe("Piscina");
  });
  it("humanizes unknown keys", () => {
    expect(amenityLabel("some_unknown_key")).toBe("Some Unknown Key");
  });
});

describe("buildExperienceGuidePrompt", () => {
  const now = new Date(2026, 5, 24); // June 2026
  const { system, user } = buildExperienceGuidePrompt(property, now);
  it("includes the city name", () => {
    expect(system + user).toContain("Florianópolis");
  });
  it("includes the current month name", () => {
    const monthName = now.toLocaleDateString("pt-BR", { month: "long" });
    expect(system + user).toContain(monthName);
  });
});
