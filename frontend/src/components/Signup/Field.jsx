// A labelled input, or a dropdown when `options` is passed, with an error message below.
export default function Field({ label, name, error, options, ...props }) {
  const style = `w-full rounded-lg border bg-surface px-3 py-2.5 text-text outline-none focus:border-primary ${
    error ? "border-error" : "border-border"
  }`;

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-text">
        {label}
      </span>
      {options ? (
        <select name={name} className={style} {...props}>
          <option value="">Choose an area</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input name={name} className={style} {...props} />
      )}
      {error && <span className="mt-1 block text-sm text-error">{error}</span>}
    </label>
  );
}
