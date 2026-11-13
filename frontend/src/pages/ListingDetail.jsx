import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/nav/Header";
import ImageGallery from "../components/listing/ImageGallery";
import InquiryForm from "../components/listing/InquiryForm";
import { getListing } from "../api/listings";
import { ROUTES } from "../paths";
import { formatKES, timeAgo } from "../utils/format";
import { PROPERTY_TYPES } from "../utils/labels";

const ROLE_LABEL = { manager: "Property manager", owner: "Property owner" };
const typeLabel = (v) => PROPERTY_TYPES.find((t) => t.value === v)?.label ?? v;
const initials = (name = "") => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

function Fact({ label, value }) {
  return (
    <div className="rounded-[10px] border border-line bg-white px-4 py-3">
      <div className="text-[13px] text-muted">{label}</div>
      <div className="mt-0.5 font-display text-lg font-semibold">{value}</div>
    </div>
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <Header />
      <main className="mx-auto max-w-[1200px] px-6 pb-14 pt-6">{children}</main>
    </div>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    getListing(id)
      .then(({ listing }) => { if (!ignore) { setListing(listing); setStatus("ready"); } })
      .catch((e) => { if (!ignore) { setError(e); setStatus("error"); } });
    return () => { ignore = true; };
  }, [id, retry]);

  if (status === "loading") {
    return (
      <Shell>
        <div role="status" aria-label="Loading listing" className="animate-pulse space-y-4">
          <div className="h-[300px] rounded-[14px] bg-white sm:h-[400px]" />
          <div className="h-8 w-2/3 rounded bg-white" />
          <div className="h-24 rounded-[14px] bg-white" />
        </div>
      </Shell>
    );
  }

  if (status === "error") {
    const gone = error?.code === "NOT_FOUND";
    return (
      <Shell>
        <div role="alert" className="flex flex-col items-start gap-3 rounded-[14px] border border-line-strong bg-white p-6">
          <p>{gone ? "This listing isn't available. It may have been removed." : "We couldn't load this listing. Try again in a moment."}</p>
          {gone ? (
            <Link to={ROUTES.listings} className="font-medium text-brand no-underline hover:text-brand-dark">Back to listings</Link>
          ) : (
            <button type="button" onClick={() => setRetry((n) => n + 1)}
              className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-brand bg-brand px-[18px] font-medium text-white hover:bg-brand-dark">
              Try again
            </button>
          )}
        </div>
      </Shell>
    );
  }

  const l = listing;
  const available = l.status === "available";

  return (
    <Shell>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <Link to={ROUTES.listings} className="text-brand">Listings</Link>
        {" / "}
        <Link to={`${ROUTES.listings}?area=${encodeURIComponent(l.area)}`} className="text-brand">{l.area}</Link>
        {" / "}
        <span>{l.building_name}</span>
      </nav>

      <ImageGallery images={l.images} title={l.title} />

      <div className="mt-6 flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-6">
          <div>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className={`rounded-full px-2.5 py-1 ${available ? "bg-brand-tint text-brand-dark" : "bg-line text-muted"}`}>
                {available ? "Available" : "Taken"}
              </span>
              <span className="rounded-full bg-line px-2.5 py-1 text-muted">{typeLabel(l.property_type)}</span>
            </div>
            <h1 className="mt-3 font-display text-[30px] font-bold leading-tight">{l.title}</h1>
            <p className="mt-1 text-[15px] text-muted">
              {l.building_name}, unit {l.unit_number} · {l.area}, {l.county}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Fact label="Rent" value={`KES ${formatKES(l.price_monthly)}`} />
            <Fact label="Type" value={typeLabel(l.property_type)} />
            <Fact label="Bedrooms" value={l.bedrooms || "None"} />
            <Fact label="Bathrooms" value={l.bathrooms} />
          </div>

          <section>
            <h2 className="font-display text-lg font-semibold">About this unit</h2>
            <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink">{l.description}</p>
          </section>

          <p className="text-[13px] text-muted">
            Listed {timeAgo(l.created_at)} · Updated {new Date(l.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>

        <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-4 lg:sticky lg:top-6">
          <div className="flex items-center gap-3 rounded-[14px] border border-line bg-white p-4">
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-tint font-display font-semibold text-brand-dark">
              {initials(l.poster.full_name)}
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">{l.poster.full_name}</div>
              <div className="text-sm text-muted">{ROLE_LABEL[l.poster.role] ?? "Poster"}</div>
            </div>
            {l.poster.is_verified && (
              <span className="ml-auto rounded-full bg-brand-tint px-2.5 py-1 text-xs font-medium text-brand-dark">Verified</span>
            )}
          </div>
          <InquiryForm listing={l} />
        </aside>
      </div>
    </Shell>
  );
}