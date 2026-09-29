export default function FormField({ label, name, error, required, ...inputProps }) {
  const id = `field-${name}`;
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        id={id}
        name={name}
        className={error ? "input input-error" : "input"}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
      />
      {error && (
        <small id={`${id}-error`} className="field-error">
          {error}
        </small>
      )}
    </div>
  );
}
