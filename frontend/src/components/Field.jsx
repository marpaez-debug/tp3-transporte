export default function Field({ label, id, error, as: Control = 'input', children, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Control id={id} aria-invalid={Boolean(error)} {...props}>
        {children}
      </Control>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}