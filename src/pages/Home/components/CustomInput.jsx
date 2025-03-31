import {forwardRef} from "react";
import "./CustomInput.css"

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
    <div className="custom-input form__group field">
      <input
        type={type}
        name={name}
        placeholder={label}
        id={name}
        ref={ref}
        className="form__field"
        {...rest}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        required
      />
      <label className="form__label" htmlFor={name}>
        {label}
      </label>
      {error && <span id={`${name}-error`} className="error-message">{error}</span>}
    </div>
  );
});

export default CustomInput;