import { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PosterGate from "../../components/poster dashboard/PosterGate";
import ListingForm from "../../components/poster dashboard/ListingForm";
import LoadError from "../../components/poster dashboard/LoadError";
import useLoad from "../../components/poster dashboard/useLoad";
import { fromListing } from "../../components/poster dashboard/data/listingForm";
import { getListing, updateListing } from "../../api/listings";
import { POSTER } from "../../paths";

function Notice({ title, text }) {
  return (
    <div className="max-w-3xl space-y-3 rounded-2xl border border-border bg-surface p-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-text-muted">{text}</p>
      <Link
        to={POSTER.listings}
        className="inline-block font-medium text-primary hover:text-primary-dark"
      >
        Back to My listings
      </Link>
    </div>
  );
}

function EditListingContent({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const load = useCallback(() => getListing(id), [id]);
  const { loading, data, error, retry } = useLoad(load);

  async function save(body) {
    const { listing } = await updateListing(id, body);
    navigate(POSTER.listings, { state: { updated: listing.title } });
  }

  if (loading) {
    return (
      <div aria-busy="true" className="max-w-3xl space-y-4">
        <div className="h-10 w-1/2 animate-pulse rounded-lg bg-border" />
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-48 animate-pulse rounded-2xl bg-border" />
        ))}
        <p className="sr-only">Loading the listing…</p>
      </div>
    );
  }

  if (error?.status === 404) {
    return (
      <Notice
        title="Listing not found"
        text="It may have been removed. Check My listings for your current units."
      />
    );
  }

  if (error) return <LoadError error={error} onRetry={retry} />;

  const listing = data.listing;

  if (listing.poster?.id !== user.id) {
    return (
      <Notice
        title="You can't edit this listing"
        text="You can only edit listings you posted."
      />
    );
  }

  return (
    <ListingForm
      key={listing.id}
      initialValues={fromListing(listing)}
      heading="Edit listing"
      intro="Changes show to tenants straight away. If you change the area, building or unit number, it's checked again so the unit isn't listed twice."
      submitLabel="Save changes"
      savingLabel="Saving…"
      onSave={save}
    />
  );
}

export default function EditListing() {
  return (
    <PosterGate needsApproval>
      {(user) => <EditListingContent user={user} />}
    </PosterGate>
  );
}
