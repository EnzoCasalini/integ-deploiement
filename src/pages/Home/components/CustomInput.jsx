import {forwardRef} from "react";

/**
 * Champ de saisie personnalisé réutilisable.
 *
 * @component
 * @name CustomInput
 * @param {Object} props
 * @param {string} props.label - Label affiché au-dessus du champ.
 * @param {string} props.name - Nom de l’input (utilisé pour l’accessibilité).
 * @param {string} props.type - Type de champ (text, email, etc.).
 * @param {string} props.value - Valeur de l’input.
 * @param {Function} props.onChange - Callback déclenché lors du changement.
 * @param {string} [props.error] - Message d’erreur à afficher.
 * @param {Object} ref - Référence transmise à l'élément input par React Hook Form.
 */
const CustomInput = forwardRef(({ label, name, type, error, ...rest }, ref) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor={name} style={{ display: "block", fontWeight: "bold" }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        ref={ref}
        {...rest}
        style={{ borderColor: error ? "red" : "#ccc", padding: "0.5rem", width: "100%" }}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && <span id={`${name}-error`} style={{ color: "red", fontSize: "0.875rem" }}>{error}</span>}
    </div>
  );
});

export default CustomInput;