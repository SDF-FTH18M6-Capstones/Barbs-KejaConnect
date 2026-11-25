const base =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border px-3 font-medium";

export default function Pagination({ page, pageCount, onPage }) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pages"
      className="flex flex-wrap justify-center gap-1.5 pt-2"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className={`${base} border-line-strong bg-white text-ink hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40`}
      >
        ‹
      </button>
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPage(n)}
          aria-current={n === page ? "page" : undefined}
          className={
            n === page
              ? `${base} border-brand bg-brand text-white`
              : `${base} border-line-strong bg-white text-ink hover:bg-canvas`
          }
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onPage(page + 1)}
        className={`${base} border-line-strong bg-white text-ink hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40`}
      >
        ›
      </button>
    </nav>
  );
}
