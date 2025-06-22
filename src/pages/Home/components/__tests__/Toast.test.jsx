import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../Toast';

// Utilisation des fake timers pour les tests de timeout
beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('Toast', () => {
  const defaultProps = {
    message: 'Ceci est un toast',
    type: 'success',
    isVisible: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('n\'affiche rien si isVisible est false', () => {
    render(<Toast {...defaultProps} isVisible={false} />);
    expect(screen.queryByText('Ceci est un toast')).not.toBeInTheDocument();
  });

  test('affiche le toast si isVisible est true', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByText('Ceci est un toast')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
  });

  test('affiche le bon message et la bonne classe selon le type', () => {
    const { container } = render(<Toast {...defaultProps} type="error" />);
    expect(screen.getByText('Ceci est un toast')).toBeInTheDocument();
    expect(container.querySelector('.toast-error')).toBeInTheDocument();
  });

  test('appelle onClose après clic sur le bouton de fermeture', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    render(<Toast {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: '×' });
    await user.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
    vi.useFakeTimers(); // on restaure les fake timers pour les autres tests
  });

  test('appelle onClose automatiquement après 5 secondes', () => {
    render(<Toast {...defaultProps} />);
    vi.advanceTimersByTime(5000);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test('n\'appelle pas onClose si isVisible est false', () => {
    render(<Toast {...defaultProps} isVisible={false} />);
    vi.advanceTimersByTime(5000);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
}); 