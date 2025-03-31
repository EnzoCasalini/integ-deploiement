import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomInput from '../CustomInput';

describe('CustomInput', () => {
  test('affiche le label correctement', () => {
    render(
      <CustomInput
        label="Nom"
        name="lastName"
        type="text"
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
  });

  test('déclenche onChange quand on tape dans l’input', async () => {
    const handleChange = vi.fn();
    render(
      <CustomInput
        label="Prénom"
        name="firstName"
        type="text"
        value=""
        onChange={handleChange}
      />
    );
    const input = screen.getByLabelText("Prénom");
    await userEvent.type(input, "Jean");
    expect(handleChange).toHaveBeenCalled();
  });

  test('affiche un message d\'erreur si présent', () => {
    render(
      <CustomInput
        label="Email"
        name="email"
        type="email"
        value=""
        onChange={() => {}}
        error="Email invalide"
      />
    );
    expect(screen.getByText("Email invalide")).toBeInTheDocument();
  });

  test('ajoute l\'attribut aria-invalid si erreur', () => {
    render(
      <CustomInput
        label="Code postal"
        name="postalCode"
        type="text"
        value=""
        onChange={() => {}}
        error="Code postal invalide"
      />
    );
    const input = screen.getByLabelText("Code postal");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  test("n'affiche pas d'erreur si la prop error est vide", () => {
    render(<CustomInput label="Ville" name="city" type="text" value="" onChange={() => {}} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});