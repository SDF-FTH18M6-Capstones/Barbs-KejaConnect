import { useId } from "react";

export default function Field({ label, hint, error, optional, children }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId]
    .filter(Boolean)
    .join(" ");
  const inputClass = `w-full rounded-lg border bg-surface px-4 py-3 text-text outline-none transition focus:ring-2 disabled:bg-bg disabled:text-text-muted ${
    error
      ? "border-error focus:ring-error/20"
      : "border-border focus:border-primary focus:ring-primary/20"
  }`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text">
        {label}
        {optional && (
          <span className="font-normal text-text-muted"> (optional)</span>
        )}
      </label>
      {children({
        id,
        className: inputClass,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
      })}
      {hint && (
        <p id={hintId} className="text-[13px] text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
