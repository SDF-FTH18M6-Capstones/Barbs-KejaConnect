import ListingCard from "./ListingCard";

const COPY = {
  VALIDATION_ERROR:
    "Those filters don't look right. Check that the minimum rent is lower than the maximum.",
  NETWORK_ERROR: "Can't reach the server. Check your connection and try again.",
  SERVER_ERROR: "Something went wrong on our side. Try again in a moment.",
};

export default function ListingGrid({ items, total, status, error, onRetry }) {
  if (status === "error") {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 rounded-[14px] border border-line-strong bg-white p-6"
      >
        <p className="text-ink">{COPY[error?.code] ?? COPY.SERVER_ERROR}</p>
        {error?.code !== "VALIDATION_ERROR" && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-brand bg-brand px-[18px] font-medium text-white hover:bg-brand-dark"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (status === "loading" && items.length === 0) {
    return (
      <div
        role="status"
        aria-label="Loading listings"
        className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[18px]"
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="h-[300px] animate-pulse rounded-[14px] border border-line bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <p className="text-[15px] text-muted" aria-live="polite">
        Showing <strong className="text-ink">{total}</strong>{" "}
        {total === 1 ? "listing" : "listings"}
      </p>

      {items.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-line-strong bg-white p-10 text-center text-muted">
          No listings match these filters. Try a wider rent range or another
          area.
        </div>
      ) : (
        <div
          className={`grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[18px] transition-opacity ${status === "loading" ? "opacity-60" : ""}`}
        >
          {items.map((l, i) => (
            <ListingCard key={l.id} listing={l} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
