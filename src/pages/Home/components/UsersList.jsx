import { useState, useEffect } from 'react';
import AdminLoginModal from './AdminLoginModal';
import Toast from './Toast';
import './UsersList.css';

/**
 * Composant pour afficher la liste des utilisateurs avec fonctionnalités d'administration
 * 
 * @component
 * @name UsersList
 * @param {Array} users - Liste des utilisateurs
 * @param {Function} onUsersUpdate - Callback pour mettre à jour la liste des utilisateurs
 * @param {Function} onAdminStateChange - Callback pour changer l'état admin
 * @param {boolean} isAdmin - État actuel de l'admin
 * @returns {JSX.Element} La liste des utilisateurs
 */
const UsersList = ({ users, onUsersUpdate, onAdminStateChange, isAdmin: parentIsAdmin }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8000";

  // Synchroniser l'état admin avec le parent
  useEffect(() => {
    if (parentIsAdmin !== undefined) {
      setIsAdmin(parentIsAdmin);
    }
  }, [parentIsAdmin]);

  // Vérifier le token au chargement
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      validateToken(token);
    } else {
      fetchPublicUsers();
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        onUsersUpdate(data);
        setIsAdmin(true);
        onAdminStateChange(true);
        setLoading(false);
      } else {
        // Token invalide
        localStorage.removeItem('adminToken');
        setIsAdmin(false);
        onAdminStateChange(false);
        fetchPublicUsers();
        showToast('Session expirée. Veuillez vous reconnecter.', 'error');
      }
    } catch (error) {
      console.error('Erreur de validation du token:', error);
      localStorage.removeItem('adminToken');
      setIsAdmin(false);
      onAdminStateChange(false);
      fetchPublicUsers();
      showToast('Erreur de connexion au serveur.', 'error');
    }
  };

  const fetchPublicUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/public-users`);
      
      if (response.ok) {
        const data = await response.json();
        onUsersUpdate(data);
      } else {
        setError('Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (token) => {
    setIsAdmin(true);
    onAdminStateChange(true);
    validateToken(token);
    showToast('Connexion administrateur réussie !', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    onAdminStateChange(false);
    fetchPublicUsers();
    showToast('Déconnexion réussie.', 'info');
  };

  const handleDeleteUser = async (userId) => {
    // Trouver l'utilisateur pour vérifier son rôle
    const userToDelete = users.find(user => user.id === userId);
    
    if (userToDelete && userToDelete.role === 'admin') {
      showToast('Impossible de supprimer un compte administrateur.', 'error');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedUsers = users.filter(user => user.id !== userId);
        onUsersUpdate(updatedUsers);
        showToast('Utilisateur supprimé avec succès.', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.detail || 'Erreur lors de la suppression.', 'error');
      }
    } catch (error) {
      console.error('Erreur de suppression:', error);
      showToast('Erreur de connexion au serveur.', 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  if (loading) {
    return (
      <div className="users-list-container">
        <div className="admin-header">
          <h2>Liste des Hunters</h2>
          {!isAdmin && (
            <button 
              className="admin-login-btn"
              onClick={() => setShowLoginModal(true)}
            >
              Se connecter en tant qu'admin
            </button>
          )}
        </div>
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-list-container">
        <div className="admin-header">
          <h2>Liste des Hunters</h2>
          {!isAdmin && (
            <button 
              className="admin-login-btn"
              onClick={() => setShowLoginModal(true)}
            >
              Se connecter en tant qu'admin
            </button>
          )}
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className={`users-list-container ${isAdmin ? 'admin-mode' : ''}`}>
        <div className="admin-header">
          <h2>
            Liste des Hunters ({users.length})
            {isAdmin && <span className="admin-badge">Admin connecté</span>}
          </h2>
          <div className="admin-actions">
            {isAdmin ? (
              <button className="logout-btn" onClick={handleLogout}>
                Se déconnecter
              </button>
            ) : (
              <button 
                className="admin-login-btn"
                onClick={() => setShowLoginModal(true)}
              >
                Se connecter en tant qu'admin
              </button>
            )}
          </div>
        </div>

        {users.length === 0 ? (
          <p className="no-users">Aucun hunter inscrit pour le moment.</p>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user.id || user.first_name} className="user-card">
                <div className="user-avatar">
                  {user.first_name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <div className="user-name">
                    {user.first_name} {isAdmin && user.last_name}
                  </div>
                  {isAdmin && (
                    <div className="user-details">
                      <div className="user-email">{user.email}</div>
                      <div className="user-birth">Né(e) le: {new Date(user.birth_date).toLocaleDateString('fr-FR')}</div>
                      <div className="user-location">{user.city}, {user.postal_code}</div>
                      <div className="user-role">Rôle: {user.role}</div>
                    </div>
                  )}
                </div>
                {isAdmin && user.role !== 'admin' && (
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user.id)}
                    title="Supprimer l'utilisateur"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </>
  );
};

export default UsersList; 