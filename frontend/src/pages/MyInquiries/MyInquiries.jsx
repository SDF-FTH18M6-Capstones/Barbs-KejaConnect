import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import InquiryCard from "../../components/inquiries/InquiryCard";
import EmptyInquiries from "../../components/inquiries/EmptyInquiries";
import Pager from "../../components/inquiries/Pager";
import { getSentInquiries } from "../../api/inquiries";
import { useCurrentUser } from "../../components/inquiries/data/currentUser";

export default function MyInquiries() {
  const { user, loading: checkingUser } = useCurrentUser();
  const location = useLocation();
  const isTenant = user?.role === "tenant";

  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isTenant) return;
    let ignore = false;
    getSentInquiries({ page, per_page: 10 })
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
  }, [page, attempt, isTenant]);

  function goToPage(newPage) {
    setStatus("loading");
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <main className="mx-auto max-w-3xl space-y-5 px-4 pt-9 pb-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold">My inquiries</h1>
            <p className="text-text-muted">
              Messages you've sent to posters. They reply to your phone or
              email.
            </p>
          </div>
          {status === "ready" && data.total > 0 && (
            <span className="text-sm text-text-muted">{data.total} sent</span>
          )}
        </div>

        {checkingUser && (
          <p className="text-text-muted">Checking your account…</p>
        )}

        {!checkingUser && !user && (
          <div className="space-y-3 rounded-2xl border border-border bg-surface p-6 text-center">
            <p>Log in to see the inquiries you've sent.</p>
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="inline-block rounded-lg bg-primary px-5 py-2.5 font-medium text-text-on-primary hover:bg-primary-dark"
            >
              Log in
            </Link>
          </div>
        )}

        {user && !isTenant && (
          <p className="rounded-2xl border border-border bg-surface p-6 text-text-muted">
            This page is for tenant accounts. Posters see the inquiries they
            receive on their dashboard.
          </p>
        )}

        {isTenant && status === "loading" && (
          <div aria-busy="true" className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-36 animate-pulse rounded-2xl bg-border"
              />
            ))}
            <p className="sr-only">Loading your inquiries…</p>
          </div>
        )}

        {isTenant && status === "error" && (
          <div
            role="alert"
            className="space-y-3 rounded-2xl border border-error/30 bg-error/10 p-6 text-error"
          >
            <p>{error}</p>
            <button
              onClick={() => {
                setStatus("loading");
                setAttempt(attempt + 1);
              }}
              className="rounded-lg bg-surface px-4 py-2 font-medium text-text"
            >
              Try again
            </button>
          </div>
        )}

        {isTenant && status === "ready" && (
          <>
            {data.items.length === 0 ? (
              <EmptyInquiries />
            ) : (
              <div className="space-y-3">
                {data.items.map((inquiry) => (
                  <InquiryCard key={inquiry.id} inquiry={inquiry} />
                ))}
              </div>
            )}
            <Pager page={data.page} pages={data.pages} onChange={goToPage} />
          </>
        )}
      </main>
    </div>
  );
}
