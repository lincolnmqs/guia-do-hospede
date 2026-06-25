import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFound from "./not-found";

// Covers PDF requisito 1 (Validações) — acessar um código de imóvel inexistente
// deve exibir uma tela de erro amigável.
describe("NotFound", () => {
  it("shows a friendly 'imóvel não encontrado' message with guidance", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { name: "Imóvel não encontrado" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/verifique o código com o seu anfitrião/i),
    ).toBeInTheDocument();
  });

  it("offers a way back to the home page", () => {
    render(<NotFound />);

    const link = screen.getByRole("link", {
      name: /voltar para a página inicial/i,
    });
    expect(link).toHaveAttribute("href", "/");
  });
});
