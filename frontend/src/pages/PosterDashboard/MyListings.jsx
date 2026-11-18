import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PosterGate from "../../components/poster dashboard/PosterGate";
import ListingsTable from "../../components/poster dashboard/ListingsTable";
import LoadError from "../../components/poster dashboard/LoadError";
import Pager from "../../components/poster dashboard/Pager";
import useLoad from "../../components/poster dashboard/useLoad";
import { getMyListings, setListingStatus } from "../../api/listings";
import { POSTER } from "../../paths";

const FILTERS = [
  { value: "", label: "All" },
  { value: "available", label: "Available" },
  { value: "taken", label: "Taken" },
];

function MyListingsContent() {
  const location = useLocation();
  const created = location.state?.created;

  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const [rowError, setRowError] = useState("");

  const load = useCallback(
    () => getMyListings({ status: filter, page, per_page: 10 }),
    [filter, page],
  );
  const { loading, error, data, retry, setData } = useLoad(load);

  function changeFilter(value) {
    setFilter(value);
    setPage(1);
    setRowError("");
  }

  async function toggleListing(listing) {
    const next = listing.status === "taken" ? "available" : "taken";
    const setStatus = (status) =>
      setData((d) => ({
        ...d,
        items: d.items.map((l) => (l.id === listing.id ? { ...l, status } : l)),
      }));

    setRowError("");
    setBusyId(listing.id);
    setStatus(next);
    try {
      await setListingStatus(listing.id, next);
    } catch (err) {
      setStatus(listing.status);
      setRowError(err.message || "Could not update the listing. Try again.");
    } finally {
      setBusyId(null);
    }
  }
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">My listings</h1>
          <p className="text-text-muted">
            Mark a unit as taken once it is let, so tenants stop sending
            inquiries.
          </p>
        </div>
        <Link
          to={POSTER.newListing}
          className="rounded-lg bg-primary px-5 py-3 font-medium text-text-on-primary hover:bg-primary-dark"
        >
          + New listing
        </Link>
      </div>

      {created && (
        <p
          role="status"
          className="rounded-lg bg-success/10 p-3 text-sm font-medium text-success"
        >
          “{created}” is now live.
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div
          role="group"
          aria-label="Filter by status"
          className="flex flex-wrap gap-2 p-5"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => changeFilter(f.value)}
              className={`min-h-9 rounded-full px-4 text-sm font-medium ${
                filter === f.value
                  ? "bg-primary text-text-on-primary"
                  : "border border-border text-text-muted hover:bg-bg hover:text-text"
              }`}
            >
              {f.label}
            </button>
          ))}
          {data && (
            <span className="ml-auto self-center text-sm text-text-muted">
              {data.total} {data.total === 1 ? "listing" : "listings"}
            </span>
          )}
        </div>

        {rowError && (
          <p
            role="alert"
            className="mx-5 mb-3 rounded-lg bg-error/10 p-3 text-sm text-error"
          >
            {rowError}
          </p>
        )}

        {loading && (
          <div aria-busy="true" className="space-y-2 p-5 pt-0">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-14 animate-pulse rounded-lg bg-border"
              />
            ))}
            <p className="sr-only">Loading your listings…</p>
          </div>
        )}

        {error && (
          <div className="p-5 pt-0">
            <LoadError error={error} onRetry={retry} />
          </div>
        )}

        {data && data.items.length === 0 && (
          <div className="space-y-3 p-8 pt-2 text-center">
            <p className="text-text-muted">
              {filter
                ? `You have no ${filter} listings.`
                : "You haven't posted any listings yet."}
            </p>
            {!filter && (
              <Link
                to={POSTER.newListing}
                className="font-medium text-primary hover:text-primary-dark"
              >
                Create your first listing
              </Link>
            )}
          </div>
        )}

        {data && data.items.length > 0 && (
          <>
            <ListingsTable
              listings={data.items}
              onToggle={toggleListing}
              busyId={busyId}
            />
            <Pager page={data.page} pages={data.pages} onPage={setPage} />
          </>
        )}
      </section>
    </>
  );
}

export default function MyListings() {
  return (
    <PosterGate needsApproval>
      <MyListingsContent />
    </PosterGate>
  );
}
