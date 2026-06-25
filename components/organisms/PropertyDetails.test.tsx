import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PropertyDetails } from "./PropertyDetails";
import type { PropertyWithRelations } from "@/lib/db/property.repository";

// Covers PDF requisito 1.1 — Dados do Imóvel: nome, tipo, localização,
// capacidade (quartos/banheiros/hóspedes) e lista de amenidades.
const property: PropertyWithRelations = {
  id: "prop-1",
  code: "FLN001",
  name: "Apartamento Beira-Mar Florianópolis",
  propertyType: "Apartamento",
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  amenities: { wifi: true, air_conditioning: true, pool: false },
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  address: {
    id: "addr-1",
    propertyId: "prop-1",
    street: "Rua Lauro Linhares",
    number: "589",
    complement: "Apto 301",
    neighborhood: "Trindade",
    city: "Florianópolis",
    state: "SC",
    postalCode: "88036-001",
  },
  operational: null,
  rules: null,
  host: null,
};

describe("PropertyDetails", () => {
  it("renders name, type and location (city, state)", () => {
    render(<PropertyDetails property={property} />);

    expect(
      screen.getByRole("heading", { name: "Apartamento Beira-Mar Florianópolis" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Apartamento")).toBeInTheDocument();
    expect(screen.getByText("Florianópolis, SC")).toBeInTheDocument();
  });

  it("renders capacity with correct pluralization", () => {
    render(<PropertyDetails property={property} />);

    expect(screen.getByText("2 quartos")).toBeInTheDocument();
    expect(screen.getByText("1 banheiro")).toBeInTheDocument(); // singular
    expect(screen.getByText("4 hóspedes")).toBeInTheDocument();
  });

  it("shows amenities with friendly PT-BR labels, not raw keys", () => {
    render(<PropertyDetails property={property} />);

    expect(screen.getByText("WiFi")).toBeInTheDocument();
    expect(screen.getByText("Ar-condicionado")).toBeInTheDocument();
    expect(screen.queryByText("air_conditioning")).not.toBeInTheDocument();
  });

  it("renders no amenities list when there are no amenities", () => {
    render(<PropertyDetails property={{ ...property, amenities: {} }} />);

    expect(screen.queryByLabelText("Lista de comodidades")).not.toBeInTheDocument();
  });
});
