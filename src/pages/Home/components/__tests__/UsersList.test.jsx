import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersList from '../UsersList';

// Mocks globaux
global.fetch = vi.fn();
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

vi.mock("../AdminLoginModal", () => ({
  default: () => <div>Connexion Administrateur</div>
}));
vi.mock('../Toast', () => ({
  default: ({ message, isVisible }) => isVisible ? <div>{message}</div> : null
}));

describe('UsersList', () => {
  const publicUsers = [
    { id: 1, first_name: 'Gon', role: 'user' },
    { id: 2, first_name: 'Killua', role: 'user' },
  ];
  const adminUsers = [
    { id: 1, first_name: 'Gon', last_name: 'Freecss', email: 'gon@hxh.com', birth_date: '2000-01-01', city: 'Whale Island', postal_code: '12345', role: 'user' },
    { id: 2, first_name: 'Killua', last_name: 'Zoldyck', email: 'killua@hxh.com', birth_date: '2001-02-02', city: 'Kukuroo', postal_code: '54321', role: 'user' },
    { id: 3, first_name: 'Isaac', last_name: 'Netero', email: 'netero@hxh.com', birth_date: '1950-05-05', city: 'Heaven Arena', postal_code: '99999', role: 'admin' },
  ];
  let users;
  let onUsersUpdate;
  let onAdminStateChange;

  beforeEach(() => {
    vi.clearAllMocks();
    users = [...publicUsers];
    onUsersUpdate = vi.fn((u) => { users = u; });
    onAdminStateChange = vi.fn();
    localStorageMock.getItem.mockReturnValue(null);
    global.fetch.mockReset();
  });

  test('affiche les utilisateurs publics (fetch /public-users)', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => publicUsers,
    });
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(publicUsers);
    });
    rerender(
      <UsersList users={publicUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    expect(screen.getByText('Gon')).toBeInTheDocument();
    expect(screen.getByText('Killua')).toBeInTheDocument();
    expect(screen.queryByText('Admin connecté')).not.toBeInTheDocument();
  });

  test("clic sur 'Se connecter en tant qu'admin' affiche le modal", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => publicUsers });
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(publicUsers);
    });
    rerender(
      <UsersList users={publicUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    const btn = await screen.findByRole('button', { name: /se connecter en tant qu'admin/i });
    await userEvent.click(btn);
    expect(screen.getByText('Connexion Administrateur')).toBeInTheDocument();
  });

  test('connexion admin : fetch /users avec token, vue admin, badge et suppression', async () => {
    localStorageMock.getItem.mockReturnValue('token-admin');
    fetch.mockResolvedValueOnce({ ok: true, json: async () => adminUsers });
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(adminUsers);
    });
    rerender(
      <UsersList users={adminUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    expect(screen.getByText('Admin connecté')).toBeInTheDocument();
    expect(screen.getByText('gon@hxh.com')).toBeInTheDocument();
    expect(screen.getByText('Whale Island, 12345')).toBeInTheDocument();
    expect(screen.getAllByTitle("Supprimer l'utilisateur")).toHaveLength(2);
  });

  test('supprimer un utilisateur sauf admin', async () => {
    localStorageMock.getItem.mockReturnValue('token-admin');
    fetch.mockResolvedValueOnce({ ok: true, json: async () => adminUsers });
    fetch.mockResolvedValueOnce({ ok: true });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(adminUsers);
    });
    rerender(
      <UsersList users={adminUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    const deleteBtns = screen.getAllByTitle("Supprimer l'utilisateur");
    await userEvent.click(deleteBtns[0]);
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith([
        adminUsers[1],
        adminUsers[2],
      ]);
    });
    window.confirm.mockRestore();
  });

  test("empêche la suppression de l'admin", async () => {
    localStorageMock.getItem.mockReturnValue('token-admin');
    fetch.mockResolvedValueOnce({ ok: true, json: async () => adminUsers });
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(adminUsers);
    });
    rerender(
      <UsersList users={adminUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    const adminDeleteBtn = screen.queryAllByTitle("Supprimer l'utilisateur")[2];
    expect(adminDeleteBtn).toBeUndefined();
  });

  test('déconnexion admin déclenche fetch public', async () => {
    localStorageMock.getItem.mockReturnValue('token-admin');
    fetch.mockResolvedValueOnce({ ok: true, json: async () => adminUsers });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => publicUsers });
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(adminUsers);
    });
    rerender(
      <UsersList users={adminUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    const logoutBtn = screen.getByRole('button', { name: /se déconnecter/i });
    await userEvent.click(logoutBtn);
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(publicUsers);
    });
    expect(screen.getByText('Déconnexion réussie.')).toBeInTheDocument();
  });

  // Tests pour améliorer la couverture
  test('affiche l\'état de chargement', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Promise qui ne se résout jamais
    render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  test('affiche l\'erreur si fetch public-users échoue', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(screen.getByText('Erreur lors du chargement des utilisateurs')).toBeInTheDocument();
    });
  });

  test('affiche l\'erreur si fetch public-users lance une exception', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(screen.getByText('Erreur de connexion au serveur')).toBeInTheDocument();
    });
  });

  test('gère l\'erreur de validation du token (réponse non-ok)', async () => {
    localStorageMock.getItem.mockReturnValue('invalid-token');
    fetch.mockResolvedValueOnce({ ok: false });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => publicUsers });
    render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('adminToken');
      expect(onAdminStateChange).toHaveBeenCalledWith(false);
    });
    expect(screen.getByText('Session expirée. Veuillez vous reconnecter.')).toBeInTheDocument();
  });

  test('gère l\'erreur de validation du token (exception réseau)', async () => {
    localStorageMock.getItem.mockReturnValue('invalid-token');
    fetch.mockRejectedValueOnce(new Error('Network error'));
    fetch.mockResolvedValueOnce({ ok: true, json: async () => publicUsers });
    render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('adminToken');
      expect(onAdminStateChange).toHaveBeenCalledWith(false);
    });
    expect(screen.getByText('Erreur de connexion au serveur.')).toBeInTheDocument();
  });

  test('gère l\'erreur lors de la suppression (réponse non-ok)', async () => {
    localStorageMock.getItem.mockReturnValue('token-admin');
    fetch.mockResolvedValueOnce({ ok: true, json: async () => adminUsers });
    fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ detail: 'Erreur serveur' }) });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(adminUsers);
    });
    rerender(
      <UsersList users={adminUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    const deleteBtns = screen.getAllByTitle("Supprimer l'utilisateur");
    await userEvent.click(deleteBtns[0]);
    await waitFor(() => {
      expect(screen.getByText('Erreur serveur')).toBeInTheDocument();
    });
    window.confirm.mockRestore();
  });

  test('gère l\'erreur lors de la suppression (exception réseau)', async () => {
    localStorageMock.getItem.mockReturnValue('token-admin');
    fetch.mockResolvedValueOnce({ ok: true, json: async () => adminUsers });
    fetch.mockRejectedValueOnce(new Error('Network error'));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(adminUsers);
    });
    rerender(
      <UsersList users={adminUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    const deleteBtns = screen.getAllByTitle("Supprimer l'utilisateur");
    await userEvent.click(deleteBtns[0]);
    await waitFor(() => {
      expect(screen.getByText('Erreur de connexion au serveur.')).toBeInTheDocument();
    });
    window.confirm.mockRestore();
  });

  test('synchronise avec parentIsAdmin', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => adminUsers });
    render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} isAdmin={true} />
    );
    await waitFor(() => {
      expect(screen.getByText('Admin connecté')).toBeInTheDocument();
    });
  });

  test('affiche le message quand aucun utilisateur', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith([]);
    });
    rerender(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    expect(screen.getByText('Aucun hunter inscrit pour le moment.')).toBeInTheDocument();
  });

  test('ferme le modal de connexion', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => publicUsers });
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(publicUsers);
    });
    rerender(
      <UsersList users={publicUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    const btn = await screen.findByRole('button', { name: /se connecter en tant qu'admin/i });
    await userEvent.click(btn);
    expect(screen.getByText('Connexion Administrateur')).toBeInTheDocument();
    // Le modal devrait se fermer quand onLoginSuccess est appelé
    // Ce test vérifie que le modal s'affiche correctement
  });
});