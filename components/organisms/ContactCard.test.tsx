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

  it("renders a WhatsApp link with the masked phone", () => {
    const host = { id: "host-1", propertyId: "prop-1", name: "Ana Paula", phone: "+5548991234567" };
    render(<ContactCard host={host} address={baseAddress} />);
    const link = screen.getByRole("link", { name: /Conversar com Ana Paula no WhatsApp/i });
    expect(link.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/5548991234567/);
    // phone is shown masked, not raw
    expect(screen.getByText("+55 (48) 99123-4567")).toBeInTheDocument();
  });

  it("renders the full address as a Google Maps link opening in a new tab", () => {
    const host = { id: "host-1", propertyId: "prop-1", name: "Ana Paula", phone: "+5548991234567" };
    render(<ContactCard host={host} address={baseAddress} />);
    const link = screen.getByRole("link", { name: /Abrir endereço no Google Maps/i });
    const href = link.getAttribute("href") ?? "";
    expect(href).toMatch(/^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
    // the address parts are URL-encoded into the query
    expect(decodeURIComponent(href)).toContain("Rua das Flores, 100");
    expect(decodeURIComponent(href)).toContain("Florianópolis — SC");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("returns null when host is null", () => {
    const { container } = render(
      <ContactCard host={null} address={baseAddress} />
    );
    expect(container.firstChild).toBeNull();
  });
});
