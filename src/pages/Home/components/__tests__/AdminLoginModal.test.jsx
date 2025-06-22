import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLoginModal from '../AdminLoginModal';

// Mock de fetch global
global.fetch = vi.fn();

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('AdminLoginModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onLoginSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset des mocks
    fetch.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('n\'affiche rien si isOpen est false', () => {
    render(<AdminLoginModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Connexion Administrateur')).not.toBeInTheDocument();
  });

  test('affiche la modale si isOpen est true', () => {
    render(<AdminLoginModal {...defaultProps} />);
    expect(screen.getByText('Connexion Administrateur')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
  });

  test('permet la saisie des champs email et mot de passe', async () => {
    const user = userEvent.setup();
    render(<AdminLoginModal {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('admin@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('soumet le formulaire avec succès et appelle onLoginSuccess', async () => {
    const user = userEvent.setup();
    const mockToken = 'mock-jwt-token';
    
    // Mock d'une réponse réussie
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: mockToken }),
    });

    render(<AdminLoginModal {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: 'Se connecter' });

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'password123',
        }),
      });
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('adminToken', mockToken);
    expect(defaultProps.onLoginSuccess).toHaveBeenCalledWith(mockToken);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test('affiche un message d\'erreur si la connexion échoue', async () => {
    const user = userEvent.setup();
    
    // Mock d'une réponse d'erreur
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Identifiants invalides' }),
    });

    render(<AdminLoginModal {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: 'Se connecter' });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Identifiants invalides')).toBeInTheDocument();
    });

    expect(defaultProps.onLoginSuccess).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  test('affiche un message d\'erreur générique si pas de détail dans la réponse', async () => {
    const user = userEvent.setup();
    
    // Mock d'une réponse d'erreur sans détail
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<AdminLoginModal {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: 'Se connecter' });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Identifiants incorrects')).toBeInTheDocument();
    });
  });

  test('affiche un message d\'erreur en cas d\'erreur réseau', async () => {
    const user = userEvent.setup();
    
    // Mock d'une erreur réseau
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<AdminLoginModal {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: 'Se connecter' });

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erreur de connexion au serveur')).toBeInTheDocument();
    });

    expect(defaultProps.onLoginSuccess).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  test('désactive les champs et le bouton pendant le chargement', async () => {
    const user = userEvent.setup();
    
    // Mock d'une réponse lente
    fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<AdminLoginModal {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: 'Se connecter' });

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Vérifier que les éléments sont désactivés pendant le chargement
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Connexion...')).toBeInTheDocument();
  });

  test('ferme la modale en cliquant sur le bouton de fermeture', async () => {
    const user = userEvent.setup();
    render(<AdminLoginModal {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: '×' });
    await user.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test('ferme la modale en cliquant sur l\'overlay', async () => {
    const user = userEvent.setup();
    render(<AdminLoginModal {...defaultProps} />);

    // L'overlay est le div avec la classe modal-overlay
    const overlay = document.querySelector('.modal-overlay');
    await user.click(overlay);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test('empêche la fermeture en cliquant sur le contenu de la modale', async () => {
    const user = userEvent.setup();
    render(<AdminLoginModal {...defaultProps} />);

    // Le contenu de la modale est le div avec la classe modal-content
    const modalContent = document.querySelector('.modal-content');
    await user.click(modalContent);

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
}); 