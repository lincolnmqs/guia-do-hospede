import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AccessInfo } from "./AccessInfo";
import type { PropertyWithRelations } from "@/lib/db/property.repository";

const baseOperational: PropertyWithRelations["operational"] = {
  id: "op-1",
  propertyId: "prop-1",
  wifiNetwork: "SeazoneGuest",
  wifiPassword: "senha123",
  isSelfCheckin: true,
  propertyAccessType: "smart_lock",
  propertyAccessInstructions: "Use o código no app.",
  propertyPassword: "1234",
  hasParkingSpot: false,
  parkingSpotIdentifier: null,
  parkingSpotInstructions: null,
};

describe("AccessInfo", () => {
  it("does NOT render parking block when hasParkingSpot is false", () => {
    render(<AccessInfo operational={{ ...baseOperational, hasParkingSpot: false }} />);
    expect(screen.queryByLabelText("Estacionamento")).not.toBeInTheDocument();
  });

  it("renders parking block when hasParkingSpot is true", () => {
    render(
      <AccessInfo
        operational={{
          ...baseOperational,
          hasParkingSpot: true,
          parkingSpotIdentifier: "Vaga 42",
          parkingSpotInstructions: "Subsolo 1, rampa à esquerda.",
        }}
      />
    );
    expect(screen.getByLabelText("Estacionamento")).toBeInTheDocument();
    expect(screen.getByText("Vaga 42")).toBeInTheDocument();
    expect(screen.getByText("Subsolo 1, rampa à esquerda.")).toBeInTheDocument();
  });

  it("renders wifi network name", () => {
    render(<AccessInfo operational={baseOperational} />);
    expect(screen.getByText("SeazoneGuest")).toBeInTheDocument();
  });

  it("returns null when operational is null", () => {
    const { container } = render(<AccessInfo operational={null} />);
    expect(container.firstChild).toBeNull();
  });
});
