export default function Pager({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const button =
    "min-h-11 rounded-lg border border-text-muted/40 bg-surface px-4 font-medium text-text hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <nav
      aria-label="Pages"
      className="flex items-center justify-center gap-3 pt-2"
    >
      <button
        className={button}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>
      <span className="text-sm text-text-muted">
        Page {page} of {pages}
      </span>
      <button
        className={button}
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
