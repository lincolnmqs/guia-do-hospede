import { describe, it, expect } from "vitest";
import { experienceGuideContentSchema } from "./experience-guide";

const valid = {
  welcome_message: "Bem-vindo!",
  restaurants: Array.from({ length: 4 }, (_, i) => ({ name: `R${i}`, distance: "1 km", description: "d" })),
  attractions: Array.from({ length: 3 }, (_, i) => ({ name: `A${i}`, distance: "2 km", description: "d" })),
  essentials: [{ name: "Farmácia X", type: "pharmacy", distance: "300 m", description: "24h" }],
  seasonal_tip: "Leve agasalho.",
};

describe("experienceGuideContentSchema", () => {
  it("accepts a valid guide", () => {
    expect(experienceGuideContentSchema.parse(valid)).toBeTruthy();
  });
  it("rejects fewer than 4 restaurants", () => {
    expect(() =>
      experienceGuideContentSchema.parse({ ...valid, restaurants: valid.restaurants.slice(0, 2) })
    ).toThrow();
  });
  it("rejects missing seasonal tip", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { seasonal_tip: _tip, ...rest } = valid;
    expect(() => experienceGuideContentSchema.parse(rest)).toThrow();
  });
});

describe("amenitiesSchema", () => {
  it("accepts a valid amenities map", async () => {
    const { amenitiesSchema } = await import("./property");
    expect(amenitiesSchema.parse({ wifi: true, pool: false })).toEqual({ wifi: true, pool: false });
  });
  it("rejects non-boolean values", async () => {
    const { amenitiesSchema } = await import("./property");
    expect(() => amenitiesSchema.parse({ wifi: "yes" })).toThrow();
  });
});
