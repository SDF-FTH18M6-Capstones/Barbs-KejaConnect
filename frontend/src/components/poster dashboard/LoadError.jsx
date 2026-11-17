export default function LoadError({ error, onRetry }) {
  return (
    <div
      role="alert"
      className="space-y-3 rounded-2xl border border-error/30 bg-error/10 p-6 text-error"
    >
      <p>{error?.message || "Something went wrong. Try again."}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-surface px-4 py-2 font-medium text-text"
      >
        Try again
      </button>
    </div>
  );
}
