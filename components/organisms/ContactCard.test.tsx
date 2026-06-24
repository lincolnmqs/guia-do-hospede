import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContactCard } from "./ContactCard";
import type { PropertyWithRelations } from "@/lib/db/property.repository";

const baseAddress: PropertyWithRelations["address"] = {
  id: "addr-1",
  propertyId: "prop-1",
  street: "Rua das Flores",
  number: "100",
  complement: null,
  neighborhood: "Centro",
  city: "Florianópolis",
  state: "SC",
  postalCode: "88010-000",
};

describe("ContactCard", () => {
  it("renders the host name", () => {
    const host = { id: "host-1", propertyId: "prop-1", name: "Ana Paula", phone: "+5548991234567" };
    render(<ContactCard host={host} address={baseAddress} />);
    expect(screen.getByText("Ana Paula")).toBeInTheDocument();
  });

  it("renders a tel: link with the host phone", () => {
    const host = { id: "host-1", propertyId: "prop-1", name: "Ana Paula", phone: "+5548991234567" };
    render(<ContactCard host={host} address={baseAddress} />);
    const link = screen.getByRole("link", { name: /Ligar para Ana Paula/i });
    expect(link).toHaveAttribute("href", "tel:+5548991234567");
  });

  it("returns null when host is null", () => {
    const { container } = render(
      <ContactCard host={null} address={baseAddress} />
    );
    expect(container.firstChild).toBeNull();
  });
});
