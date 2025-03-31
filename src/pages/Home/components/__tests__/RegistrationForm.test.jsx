import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrationForm from "../RegistrationForm";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("RegistrationForm – intégration", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const fillAllFields = async () => {
    await userEvent.type(screen.getByLabelText("Nom"), "Dupont");
    await userEvent.type(screen.getByLabelText("Prénom"), "Marie-Hélène");
    await userEvent.type(screen.getByLabelText("Email"), "marie@example.com");
    await userEvent.type(screen.getByLabelText("Date de naissance"), "1990-01-01");
    await userEvent.type(screen.getByLabelText("Ville"), "Paris");
    await userEvent.type(screen.getByLabelText("Code postal"), "75000");
  };

  test("le bouton est désactivé si tous les champs ne sont pas remplis", async () => {
    render(<RegistrationForm />);
    const submitButton = screen.getByRole("button", { name: /sauvegarder/i });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    await userEvent.type(screen.getByLabelText("Prénom"), "Jean");

    expect(submitButton).toBeDisabled();
  });

  test("affiche les erreurs après un submit invalide", async () => {
    render(<RegistrationForm />);
    const submitButton = screen.getByRole("button", { name: /sauvegarder/i });
    await fillAllFields();
    await userEvent.clear(screen.getByLabelText("Email"));
    await userEvent.type(screen.getByLabelText("Email"), "bademail");
    await userEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith("Veuillez corriger les erreurs.");
    expect(await screen.findByText(/email invalide/i)).toBeInTheDocument();
  });

  test("valide le formulaire : toast de succès + reset + localStorage", async () => {
    render(<RegistrationForm />);
    const submitButton = screen.getByRole("button", { name: /sauvegarder/i });

    await fillAllFields();
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Formulaire sauvegardé avec succès !");
    });

    const stored = JSON.parse(localStorage.getItem("userData"));
    expect(stored).toMatchObject({
      firstName: "Marie-Hélène",
      lastName: "Dupont",
      email: "marie@example.com",
    });

    expect(screen.getByLabelText("Nom").value).toBe("");
    expect(screen.getByLabelText("Email").value).toBe("");
  });

  test("corrige une erreur et l'erreur disparaît", async () => {
    render(<RegistrationForm />);
    const submitButton = screen.getByRole("button", { name: /sauvegarder/i });

    await fillAllFields();
    await userEvent.clear(screen.getByLabelText("Email"));
    await userEvent.type(screen.getByLabelText("Email"), "bademail");
    await userEvent.click(submitButton);

    expect(await screen.findByText(/email invalide/i)).toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText("Email"));
    await userEvent.type(screen.getByLabelText("Email"), "good@email.com");

    await waitFor(() => {
      expect(screen.queryByText(/email invalide/i)).not.toBeInTheDocument();
    });
  });
});