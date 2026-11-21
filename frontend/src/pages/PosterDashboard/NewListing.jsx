import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PosterGate from "../../components/poster dashboard/PosterGate";
import ListingForm from "../../components/poster dashboard/ListingForm";
import { EMPTY_LISTING } from "../../components/poster dashboard/data/listingForm";
import { POSTER } from "../../paths";
import { useListings } from "../../providers/ListingsProvider";

function NewListingContent() {
  const navigate = useNavigate();
  const { newlisting, createListing } = useListings();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && !newlisting.loading && newlisting.listing) {
      navigate(POSTER.listings, {
        state: { created: newlisting.listing.title },
      });
    }
  }, [submitted, newlisting.loading, newlisting.listing, navigate]);

  async function save(body) {
    setSubmitted(true);
    const res = await createListing(body);
    if (res?.error) {
      setSubmitted(false);
      throw res.error;
    }
  }

  return (
    <ListingForm
      initialValues={EMPTY_LISTING}
      heading="New listing"
      intro="Tenants see these details. The area, building and unit number are checked so the same unit can't be listed twice."
      submitLabel="Publish listing"
      savingLabel="Publishing…"
      onSave={save}
      externalError={submitted ? newlisting.error : null}
      isSubmitting={submitted && newlisting.loading}
    />
  );
}

export default function NewListing() {
  return (
    <PosterGate needsApproval>
      <NewListingContent />
    </PosterGate>
  );
}
