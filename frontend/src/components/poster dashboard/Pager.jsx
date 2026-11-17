export default function Pager({ page, pages, onPage }) {
  if (!pages || pages <= 1) return null;
  const button =
    "min-h-10 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text hover:bg-bg disabled:opacity-50";
  return (
    <nav
      aria-label="Pages"
      className="flex items-center justify-center gap-3 p-4"
    >
      <button
        type="button"
        className={button}
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        Previous
      </button>
      <span className="text-sm text-text-muted">
        Page {page} of {pages}
      </span>
      <button
        type="button"
        className={button}
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
