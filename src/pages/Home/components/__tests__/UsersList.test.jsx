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

describe('UsersList', () => {
  const publicUsers = [
    { id: 1, first_name: 'Gon', role: 'user' },
    { id: 2, first_name: 'Killua', role: 'user' },
  ];
  const adminUsers = [
    { id: 1, first_name: 'Gon', last_name: 'Freecss', email: 'gon@hxh.com', birth_date: '2000-01-01', city: 'Whale Island', postal_code: '12345', role: 'user' },
    { id: 2, first_name: 'Killua', last_name: 'Zoldyck', email: 'killua@hxh.com', birth_date: '2001-02-02', city: 'Kukuroo', postal_code: '54321', role: 'user' },
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
    localStorageMock.setItem.mockReset();
    localStorageMock.removeItem.mockReset();
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
    // Re-render avec les utilisateurs mis à jour
    rerender(
      <UsersList users={publicUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    // Vérifie le rendu d'un utilisateur public
    expect(screen.getByText('Gon')).toBeInTheDocument();
    expect(screen.getByText('Killua')).toBeInTheDocument();
    // Pas de badge admin ni bouton suppression
    expect(screen.queryByText('Admin connecté')).not.toBeInTheDocument();
    expect(screen.queryByTitle("Supprimer l'utilisateur")).not.toBeInTheDocument();
  });

  test("clic sur 'Se connecter en tant qu'admin' affiche le modal", async () => {
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
    const btn = await screen.findByRole('button', { name: /se connecter en tant qu'admin/i });
    await userEvent.click(btn);
    expect(screen.getByText('Connexion Administrateur')).toBeInTheDocument();
  });

  test('connexion admin : fetch /users avec token, vue admin, badge et suppression', async () => {
    // Simule un token déjà présent
    localStorageMock.getItem.mockReturnValue('token-admin');
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => adminUsers,
    });
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(adminUsers);
    });
    // Re-render avec les utilisateurs admin
    rerender(
      <UsersList users={adminUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    // Badge admin
    expect(screen.getByText('Admin connecté')).toBeInTheDocument();
    // Vue admin : détails et bouton suppression
    expect(screen.getByText('gon@hxh.com')).toBeInTheDocument();
    expect(screen.getByText('Whale Island, 12345')).toBeInTheDocument();
    expect(screen.getAllByTitle("Supprimer l'utilisateur")).toHaveLength(2);
  });

  test('clic sur bouton "Supprimer" : fetch DELETE et MAJ de la liste', async () => {
    // Simule un token admin
    localStorageMock.getItem.mockReturnValue('token-admin');
    fetch.mockResolvedValueOnce({ ok: true, json: async () => adminUsers }); // fetch /users
    // On simule la suppression du premier utilisateur
    fetch.mockResolvedValueOnce({ ok: true }); // fetch DELETE
    // Mock confirm
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
    // On attend le rendu
    await waitFor(() => {
      expect(screen.getByText('gon@hxh.com')).toBeInTheDocument();
    });
    const deleteBtns = screen.getAllByTitle("Supprimer l'utilisateur");
    await userEvent.click(deleteBtns[0]);
    await waitFor(() => {
      // OnUsersUpdate doit être appelé avec la liste MAJ (sans le premier user)
      expect(onUsersUpdate).toHaveBeenCalledWith([
        adminUsers[1],
      ]);
    });
    // Toast de succès
    expect(screen.getByText('Utilisateur supprimé avec succès.')).toBeInTheDocument();
    window.confirm.mockRestore();
  });

  test('clic sur "Supprimer" puis annulation du confirm : pas de suppression', async () => {
    localStorageMock.getItem.mockReturnValue('token-admin');
    fetch.mockResolvedValueOnce({ ok: true, json: async () => adminUsers });
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { rerender } = render(
      <UsersList users={[]} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(onUsersUpdate).toHaveBeenCalledWith(adminUsers);
    });
    rerender(
      <UsersList users={adminUsers} onUsersUpdate={onUsersUpdate} onAdminStateChange={onAdminStateChange} />
    );
    await waitFor(() => {
      expect(screen.getByText('gon@hxh.com')).toBeInTheDocument();
    });
    const deleteBtns = screen.getAllByTitle("Supprimer l'utilisateur");
    await userEvent.click(deleteBtns[0]);
    // OnUsersUpdate ne doit pas être appelé
    expect(onUsersUpdate).not.toHaveBeenCalledWith([
      adminUsers[1],
    ]);
    window.confirm.mockRestore();
  });
}); 