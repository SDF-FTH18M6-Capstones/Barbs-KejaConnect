import { useState } from "react";
import { Link } from "react-router-dom";
import PosterGate from "../../components/poster dashboard/PosterGate";
import StatCard from "../../components/poster dashboard/StatCard";
import ListingsTable from "../../components/poster dashboard/ListingsTable";
import RecentInquiries from "../../components/poster dashboard/My listings/RecentInquiries";
import LoadError from "../../components/poster dashboard/LoadError";
import useLoad from "../../components/poster dashboard/useLoad";
import { getMyListings, setListingStatus } from "../../api/listings";
import { getReceivedInquiries } from "../../api/inquiries";

function greeting(hour = new Date().getHours()) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

async function loadDashboard() {
  const [recent, available, taken, inquiries] = await Promise.all([
    getMyListings({ per_page: 5 }),
    getMyListings({ status: "available", per_page: 1 }),
    getMyListings({ status: "taken", per_page: 1 }),
    getReceivedInquiries({ per_page: 50 }),
  ]);
  return {
    listings: recent,
    summary: {
      available: available.total,
      taken: taken.total,
      inquiries_total: inquiries.total,
      inquiries_unread: inquiries.items.filter((q) => q.status === "new")
        .length,
    },
    inquiries: inquiries.items.slice(0, 3),
  };
}

function DashboardHome({ user }) {
  const { loading, data, error, retry, setData } = useLoad(loadDashboard);
  const [busyId, setBusyId] = useState(null);
  const [rowError, setRowError] = useState("");

  async function toggleListing(listing) {
    const next = listing.status === "taken" ? "available" : "taken";
    const apply = (newStatus) =>
      setData((d) => {
        const change =
          newStatus === listing.status ? 0 : newStatus === "taken" ? 1 : -1;
        return {
          ...d,
          listings: {
            ...d.listings,
            items: d.listings.items.map((l) =>
              l.id === listing.id ? { ...l, status: newStatus } : l,
            ),
          },
          summary: {
            ...d.summary,
            taken: d.summary.taken + change,
            available: d.summary.available - change,
          },
        };
      });

    setRowError("");
    setBusyId(listing.id);
    apply(next);
    try {
      await setListingStatus(listing.id, next);
    } catch (err) {
      apply(listing.status);
      setRowError(err.message || "Could not update the listing. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="inline-block rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
            Approved {user.role}
            {user.company_name && ` · ${user.company_name}`}
          </span>
          <h1 className="text-3xl font-semibold">
            {greeting()}, {user.full_name.split(" ")[0]}
          </h1>
        </div>
        <Link
          to="/listings/new"
          className="rounded-lg bg-primary px-5 py-3 font-medium text-text-on-primary hover:bg-primary-dark"
        >
          + New listing
        </Link>
      </div>

      {loading && (
        <div aria-busy="true" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-24 animate-pulse rounded-2xl bg-border"
              />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-border" />
          <p className="sr-only">Loading your dashboard…</p>
        </div>
      )}

      {error && <LoadError error={error} onRetry={retry} />}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label="Available listings"
              value={data.summary.available}
            />
            <StatCard label="Marked as taken" value={data.summary.taken} />
            <StatCard
              label="Inquiries received"
              value={data.summary.inquiries_total}
            />
            <StatCard
              label="Unread inquiries"
              value={data.summary.inquiries_unread}
            />
          </div>

          <section className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <h2 className="text-lg font-semibold">My listings</h2>
              <Link
                to="/dashboard/listings"
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                View all {data.listings.total}
              </Link>
            </div>
            {rowError && (
              <p
                role="alert"
                className="mx-5 mb-3 rounded-lg bg-error/10 p-3 text-sm text-error"
              >
                {rowError}
              </p>
            )}
            {data.listings.items.length === 0 ? (
              <div className="space-y-3 p-8 pt-2 text-center">
                <p className="text-text-muted">
                  You haven't posted any listings yet.
                </p>
                <Link
                  to="/listings/new"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Create your first listing
                </Link>
              </div>
            ) : (
              <ListingsTable
                listings={data.listings.items}
                onToggle={toggleListing}
                busyId={busyId}
              />
            )}
          </section>

          <RecentInquiries inquiries={data.inquiries} />
        </>
      )}
    </>
  );
}

export default function PosterDashboard() {
  return (
    <PosterGate needsApproval>
      {(user) => <DashboardHome user={user} />}
    </PosterGate>
  );
}
