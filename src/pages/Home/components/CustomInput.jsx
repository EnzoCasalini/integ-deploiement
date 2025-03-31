import {forwardRef} from "react";

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