import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StayRules } from "./StayRules";
import type { PropertyWithRelations } from "@/lib/db/property.repository";

// Covers PDF requisito 1.3 — Regras da Estadia: horários de check-in/check-out
// e políticas (animais, fumantes, crianças, festas/eventos).
const rules: NonNullable<PropertyWithRelations["rules"]> = {
  id: "rules-1",
  propertyId: "prop-1",
  checkInTime: "15:00",
  checkOutTime: "11:00",
  allowPet: false,
  smokingPermitted: false,
  suitableForChildren: true,
  suitableForBabies: true,
  eventsPermitted: false,
};

describe("StayRules", () => {
  it("renders check-in and check-out times", () => {
    render(<StayRules rules={rules} />);

    expect(screen.getByText("Check-in")).toBeInTheDocument();
    expect(screen.getByText("15:00")).toBeInTheDocument();
    expect(screen.getByText("Check-out")).toBeInTheDocument();
    expect(screen.getByText("11:00")).toBeInTheDocument();
  });

  it("maps each policy to an allowed / not-allowed status", () => {
    render(<StayRules rules={rules} />);

    const petRow = screen.getByText("Animais de estimação").closest("div")!;
    expect(within(petRow).getByLabelText("Não permitido")).toBeInTheDocument();

    const childrenRow = screen.getByText("Crianças").closest("div")!;
    expect(within(childrenRow).getByLabelText("Permitido")).toBeInTheDocument();

    // 2 permitidas (crianças, bebês) e 3 não permitidas (animais, fumar, festas)
    expect(screen.getAllByLabelText("Permitido")).toHaveLength(2);
    expect(screen.getAllByLabelText("Não permitido")).toHaveLength(3);
  });

  it("renders nothing when rules are absent", () => {
    const { container } = render(<StayRules rules={null} />);
    expect(container.firstChild).toBeNull();
  });
});
