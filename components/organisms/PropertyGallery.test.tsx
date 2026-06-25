import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { PropertyGallery } from "./PropertyGallery";

const images = ["https://minio.local/a.jpg", "https://minio.local/b.jpg"];

describe("PropertyGallery image loading states", () => {
  it("shows a placeholder for each image until it loads", () => {
    render(<PropertyGallery images={images} name="Casa Azul" />);

    // Mobile primary + desktop primary + one side image are rendered up front.
    expect(
      screen.getAllByTestId("gallery-image-placeholder").length,
    ).toBeGreaterThan(0);
  });

  it("fades the photo in and drops the placeholder once it loads", async () => {
    render(<PropertyGallery images={images} name="Casa Azul" />);

    const photo = screen.getAllByAltText("Foto principal de Casa Azul")[0];
    expect(photo).toHaveClass("opacity-0");

    // next/image resolves onLoad asynchronously (via img.decode()).
    fireEvent.load(photo);

    await waitFor(() => expect(photo).toHaveClass("opacity-100"));
  });

  it("degrades to an 'unavailable' state when an image fails", () => {
    render(<PropertyGallery images={images} name="Casa Azul" />);

    const photo = screen.getAllByAltText("Foto principal de Casa Azul")[0];
    fireEvent.error(photo);

    expect(screen.getAllByText("Imagem indisponível").length).toBeGreaterThan(0);
  });

  it("renders an empty state when there are no images", () => {
    render(<PropertyGallery images={[]} name="Casa Azul" />);

    expect(screen.getByText("Sem fotos disponíveis")).toBeInTheDocument();
    expect(
      screen.queryByTestId("gallery-image-placeholder"),
    ).not.toBeInTheDocument();
  });

  it("shows a fresh placeholder for the lightbox photo", () => {
    render(<PropertyGallery images={images} name="Casa Azul" />);

    // Open the lightbox from the mobile primary trigger.
    fireEvent.click(screen.getByLabelText("Ampliar fotos de Casa Azul"));

    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByTestId("gallery-image-placeholder"),
    ).toBeInTheDocument();
  });
});
