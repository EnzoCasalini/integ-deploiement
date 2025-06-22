import { useEffect } from 'react';
import './Toast.css';

/**
 * Composant Toast pour afficher des messages
 * 
 * @component
 * @name Toast
 * @param {string} message - Message à afficher
 * @param {string} type - Type de toast ('success', 'error', 'info')
 * @param {boolean} isVisible - État de visibilité
 * @param {Function} onClose - Fonction de fermeture
 * @returns {JSX.Element|null} Le toast
 */
const Toast = ({ message, type = 'info', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Toast; 