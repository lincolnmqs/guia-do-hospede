import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AmenityItem } from "./AmenityItem";

describe("AmenityItem", () => {
  it("renders the translated amenity label", () => {
    render(<AmenityItem amenityKey="bbq_grill" available />);
    expect(screen.getByText("Churrasqueira")).toBeInTheDocument();
  });

  it("renders a check icon when available", () => {
    render(<AmenityItem amenityKey="wifi" available />);
    expect(screen.getByText("WiFi")).toBeInTheDocument();
  });

  it("renders a fallback label for unknown amenity keys", () => {
    render(<AmenityItem amenityKey="hot_tub" available />);
    expect(screen.getByText("Hot Tub")).toBeInTheDocument();
  });

  it("applies reduced opacity when unavailable", () => {
    const { container } = render(<AmenityItem amenityKey="pool" available={false} />);
    expect(container.firstChild).toHaveClass("opacity-40");
  });
});
