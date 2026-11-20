import { useCallback, useState } from "react";
import PosterGate from "../../components/poster dashboard/PosterGate";
import ReceivedInquiry from "../../components/poster dashboard/ReceivedInquiry";
import LoadError from "../../components/poster dashboard/LoadError";
import Pager from "../../components/poster dashboard/Pager";
import useLoad from "../../components/poster dashboard/useLoad";
import { getReceivedInquiries } from "../../api/inquiries";
import { getMyListings } from "../../api/listings";
import { useInquiries } from "../../providers/InquiriesProvider";
import { useListings } from "../../providers/ListingsProvider";

const loadListings = () => getMyListings({ per_page: 50 });

function InquiriesContent() {
  const { inquiriesData } = useInquiries();
  console.log(inquiriesData);
  const [listingId, setListingId] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(
    () => getReceivedInquiries({ listing_id: listingId, page, per_page: 10 }),
    [listingId, page],
  );
  const { loading, data, error, retry } = useLoad(load);
  const { listingsData } = useListings(); // for the "Listing" dropdown

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">Inquiries</h1>
          <p className="text-text-muted">
            Messages from tenants about your listings. Reply by phone or email.
          </p>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Listing
          <select
            value={listingId}
            onChange={(e) => {
              setListingId(e.target.value);
              setPage(1);
            }}
            className="min-h-11 rounded-lg border border-border bg-surface px-3 font-normal"
          >
            <option value="">All listings</option>
            {listingsData.items.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title} · {l.building_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {inquiriesData.loading && (
        <div aria-busy="true" className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 animate-pulse rounded-xl bg-border" />
          ))}
          <p className="sr-only">Loading inquiries…</p>
        </div>
      )}

      {inquiriesData.error && (
        <LoadError error={inquiriesData.error} onRetry={retry} />
      )}

      {inquiriesData && inquiriesData.items.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center text-text-muted">
          {listingId
            ? "No inquiries for this listing yet."
            : "No inquiries yet. They'll show here when tenants message you."}
        </div>
      )}

      {inquiriesData && inquiriesData.items.length > 0 && (
        <section aria-label="Inquiries" className="space-y-3">
          <p className="text-sm text-text-muted">
            {inquiriesData.total}{" "}
            {inquiriesData.total === 1 ? "inquiry" : "inquiries"}
          </p>
          {inquiriesData.items.map((q) => (
            <ReceivedInquiry key={q.id} inquiry={q} />
          ))}
          <Pager
            page={inquiriesData.page}
            pages={inquiriesData.pages}
            onPage={setPage}
          />
        </section>
      )}
    </>
  );
}

export default function PosterInquiries() {
  return (
    <PosterGate>
      <InquiriesContent />
    </PosterGate>
  );
}
