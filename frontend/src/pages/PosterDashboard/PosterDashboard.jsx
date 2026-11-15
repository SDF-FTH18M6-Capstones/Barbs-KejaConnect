import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PosterLayout from "../../components/poster dashboard/PosterLayout";
import StatCard from "../../components/poster dashboard/StatCard";
import ListingsTable from "../../components/poster dashboard/ListingsTable";
import RecentInquiries from "../../components/poster dashboard/My listings/RecentInquiries";
import {
  getPosterDashboard,
  setListingStatus,
} from "../../components/poster dashboard/data/posterApi";
import { getCurrentUser } from "../../components/inquiries/data/currentUser";

function greeting(hour = new Date().getHours()) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function PosterDashboard() {
  const user = getCurrentUser();
  const isPoster = user?.role === "manager" || user?.role === "owner";
  const approved =
    isPoster && (user.approval_status ?? "approved") === "approved";

  const [data, setData] = useState(null); // { summary, listings, inquiries }
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [rowError, setRowError] = useState("");

  useEffect(() => {
    if (!approved) return;
    let ignore = false; // stops an old request from overwriting a newer one
    setStatus("loading");
    getPosterDashboard()
      .then((result) => {
        if (ignore) return;
        setData(result);
        setStatus("ready");
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, [attempt, approved]);

  // Mark as taken / available: update the screen first, undo if the server says no
  async function toggleListing(listing) {
    const next = listing.status === "taken" ? "available" : "taken";
    const apply = (state, newStatus) => {
      const items = state.listings.items.map((l) =>
        l.id === listing.id ? { ...l, status: newStatus } : l,
      );
      const change = newStatus === "taken" ? 1 : -1;
      return {
        ...state,
        listings: { ...state.listings, items },
        summary: {
          ...state.summary,
          taken: state.summary.taken + change,
          available: state.summary.available - change,
        },
      };
    };

    setRowError("");
    setBusyId(listing.id);
    setData((d) => apply(d, next));
    try {
      await setListingStatus(listing.id, next);
    } catch (err) {
      setData((d) => apply(d, listing.status));
      setRowError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  // Not a poster: tenants and visitors don't have a dashboard
  if (!isPoster) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg p-4 text-text">
        <div className="max-w-md space-y-3 rounded-2xl border border-border bg-surface p-6 text-center">
          <h1 className="text-xl font-semibold">
            The dashboard is for property managers and owners
          </h1>
          <p className="text-text-muted">
            {user
              ? "Your account is a tenant account."
              : "Log in with a manager or owner account to see it."}
          </p>
          <Link
            to={user ? "/" : "/login"}
            className="inline-block rounded-lg bg-primary px-5 py-2.5 font-medium text-text-on-primary hover:bg-primary-dark"
          >
            {user ? "Browse listings" : "Log in"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PosterLayout user={user} unread={data?.summary.inquiries_unread ?? 0}>
      {!approved && (
        <div className="space-y-2 rounded-2xl bg-accent/20 p-5 text-text-on-accent">
          <h1 className="text-xl font-semibold">
            Your account is waiting for approval
          </h1>
          <p>
            You can create listings once an admin has checked your documents.
          </p>
          <Link to="/dashboard/verification" className="font-medium underline">
            Check your verification
          </Link>
        </div>
      )}

      {approved && (
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

          {status === "loading" && (
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

          {status === "error" && (
            <div
              role="alert"
              className="space-y-3 rounded-2xl border border-error/30 bg-error/10 p-6 text-error"
            >
              <p>{error}</p>
              <button
                onClick={() => setAttempt(attempt + 1)}
                className="rounded-lg bg-surface px-4 py-2 font-medium text-text"
              >
                Try again
              </button>
            </div>
          )}

          {status === "ready" && (
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

              <RecentInquiries inquiries={data.inquiries.items} />
            </>
          )}
        </>
      )}
    </PosterLayout>
  );
}
