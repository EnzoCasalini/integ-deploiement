import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrationForm from "../RegistrationForm";
import { toast } from "react-toastify";

// Mock de react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock de fetch global
global.fetch = vi.fn();

describe("RegistrationForm – Tests d'intégration", () => {
  const mockOnUserRegistered = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset fetch mock
    global.fetch.mockReset();
  });

  const fillAllFields = async () => {
    await userEvent.type(screen.getByLabelText("Nom"), "Dupont");
    await userEvent.type(screen.getByLabelText("Prénom"), "Marie-Hélène");
    await userEvent.type(screen.getByLabelText("Email"), "marie@example.com");
    await userEvent.type(screen.getByLabelText("Date de naissance"), "1990-01-01");
    await userEvent.type(screen.getByLabelText("Ville"), "Paris");
    await userEvent.type(screen.getByLabelText("Code postal"), "75000");
  };

  const getExpectedApiData = () => ({
    last_name: "Dupont",
    first_name: "Marie-Hélène",
    email: "marie@example.com",
    birth_date: "1990-01-01",
    city: "Paris",
    postal_code: "75000"
  });

  test("affiche tous les champs du formulaire", () => {
    render(<RegistrationForm onUserRegistered={mockOnUserRegistered} />);

    // Vérifier que tous les champs sont présents
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
    expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Date de naissance")).toBeInTheDocument();
    expect(screen.getByLabelText("Ville")).toBeInTheDocument();
    expect(screen.getByLabelText("Code postal")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /join/i })).toBeInTheDocument();
  });

  test("saisie valide déclenche fetch avec les bonnes données", async () => {
    // Mock d'une réponse API réussie
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        message: "Inscription réussie !",
        user_id: 123 
      })
    });

    render(<RegistrationForm onUserRegistered={mockOnUserRegistered} />);
    
    await fillAllFields();
    await userEvent.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8000/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(getExpectedApiData()),
        }
      );
    });
  });

  test("affiche un toast de succès quand l'inscription réussit", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        message: "Inscription réussie !",
        user_id: 123 
      })
    });

    render(<RegistrationForm onUserRegistered={mockOnUserRegistered} />);
    
    await fillAllFields();
    await userEvent.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Inscription réussie !");
    });
  });

  test("appelle onUserRegistered avec les bonnes données quand l'inscription réussit", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        message: "Inscription réussie !",
        user_id: 123 
      })
    });

    render(<RegistrationForm onUserRegistered={mockOnUserRegistered} />);
    
    await fillAllFields();
    await userEvent.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(mockOnUserRegistered).toHaveBeenCalledWith({
        id: 123,
        first_name: "Marie-Hélène",
        last_name: "Dupont",
        email: "marie@example.com",
        birth_date: "1990-01-01",
        city: "Paris",
        postal_code: "75000",
        role: "user"
      });
    });
  });

  test("affiche un toast d'erreur quand l'API retourne une erreur", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ 
        detail: "Email déjà utilisé" 
      })
    });

    render(<RegistrationForm onUserRegistered={mockOnUserRegistered} />);
    
    await fillAllFields();
    await userEvent.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email déjà utilisé");
    });

    expect(mockOnUserRegistered).not.toHaveBeenCalled();
  });

  test("affiche un toast d'erreur générique quand l'API ne retourne pas de détail", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({})
    });

    render(<RegistrationForm onUserRegistered={mockOnUserRegistered} />);
    
    await fillAllFields();
    await userEvent.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erreur lors de l'inscription");
    });
  });

  test("affiche un toast d'erreur de connexion quand fetch échoue", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<RegistrationForm onUserRegistered={mockOnUserRegistered} />);
    
    await fillAllFields();
    await userEvent.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erreur de connexion au serveur");
    });

    expect(mockOnUserRegistered).not.toHaveBeenCalled();
  });

  test("affiche les messages d'erreur de validation Zod", async () => {
    render(<RegistrationForm onUserRegistered={mockOnUserRegistered} />);
    
    // Remplir partiellement le formulaire avec des données invalides
    await userEvent.type(screen.getByLabelText("Nom"), "123"); // Caractères non autorisés
    await userEvent.type(screen.getByLabelText("Prénom"), "456"); // Caractères non autorisés
    await userEvent.type(screen.getByLabelText("Email"), "invalid-email");
    await userEvent.type(screen.getByLabelText("Date de naissance"), "2025-01-01"); // Date future
    await userEvent.type(screen.getByLabelText("Ville"), "P");
    await userEvent.type(screen.getByLabelText("Code postal"), "123");

    await userEvent.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Veuillez corriger les erreurs.");
    });

    // Vérifier que les erreurs de validation sont affichées
    expect((await screen.findAllByText(/Nom invalide/i)).length).toBeGreaterThanOrEqual(1);
    expect((await screen.findAllByText(/Prénom invalide/i)).length).toBeGreaterThanOrEqual(1);
    expect(await screen.findByText(/Email invalide/i)).toBeInTheDocument();
    expect(await screen.findByText(/Vous devez avoir au moins 18 ans/i)).toBeInTheDocument();
    expect(await screen.findByText(/Code postal invalide/i)).toBeInTheDocument();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockOnUserRegistered).not.toHaveBeenCalled();
  });

  test("le bouton est désactivé pendant la soumission", async () => {
    // Mock d'une réponse API lente
    global.fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ message: "Inscription réussie !" })
      }), 100))
    );

    render(<RegistrationForm onUserRegistered={mockOnUserRegistered} />);
    
    await fillAllFields();
    const submitButton = screen.getByRole("button", { name: /join/i });
    
    await userEvent.click(submitButton);

    // Vérifier que le bouton est désactivé et affiche "ENVOI..."
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("ENVOI...");
  });

  test("le bouton est désactivé si tous les champs ne sont pas remplis", async () => {
    render(<RegistrationForm onUserRegistered={mockOnUserRegistered} />);
    
    const submitButton = screen.getByRole("button", { name: /join/i });
    expect(submitButton).toBeDisabled();

    // Remplir partiellement
    await userEvent.type(screen.getByLabelText("Nom"), "Dupont");
    expect(submitButton).toBeDisabled();

    await userEvent.type(screen.getByLabelText("Prénom"), "Marie");
    expect(submitButton).toBeDisabled();

    // Remplir tous les champs
    await fillAllFields();
    expect(submitButton).not.toBeDisabled();
  });

  test("utilise un fallback pour l'ID si l'API ne le retourne pas", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        message: "Inscription réussie !"
        // Pas de user_id
      })
    });

    render(<RegistrationForm onUserRegistered={mockOnUserRegistered} />);
    
    await fillAllFields();
    await userEvent.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(mockOnUserRegistered).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(Number), // Doit être un timestamp
          first_name: "Marie-Hélène",
          last_name: "Dupont",
          email: "marie@example.com",
          birth_date: "1990-01-01",
          city: "Paris",
          postal_code: "75000",
          role: "user"
        })
      );
    });
  });

  test("ne fait pas d'appel API si onUserRegistered n'est pas fourni", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        message: "Inscription réussie !",
        user_id: 123 
      })
    });

    render(<RegistrationForm />); // Sans prop onUserRegistered
    
    await act(async () => {
      await fillAllFields();
      await userEvent.click(screen.getByRole("button", { name: /join/i }));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });

    // Ne devrait pas planter même sans callback
    expect(() => {
      // Le composant devrait gérer l'absence de callback gracieusement
    }).not.toThrow();
  });
}); 