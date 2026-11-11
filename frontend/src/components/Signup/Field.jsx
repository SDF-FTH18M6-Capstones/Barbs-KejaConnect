import { useId } from "react";

export default function Field({ label, name, error, hint, options, ...props }) {
  const msgId = useId();
  const style = `w-full min-h-11 rounded-lg border bg-surface px-3 py-2.5 text-text outline-none placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
    error ? "border-error" : "border-text-muted/40"
  }`;
  const a11y = {
    "aria-invalid": !!error,
    "aria-describedby": error || hint ? msgId : undefined,
  };

  return (
    <div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-text">
          {label}
        </span>
        {options ? (
          <select name={name} className={style} {...a11y} {...props}>
            <option value="">Choose an area</option>
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input name={name} className={style} {...a11y} {...props} />
        )}
      </label>
      {error ? (
        <p id={msgId} className="mt-1.5 text-[13px] text-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={msgId} className="mt-1.5 text-[13px] text-text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
