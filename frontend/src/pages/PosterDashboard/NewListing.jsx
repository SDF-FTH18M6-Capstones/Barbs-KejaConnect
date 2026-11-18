import { useNavigate } from "react-router-dom";
import PosterGate from "../../components/poster dashboard/PosterGate";
import ListingForm from "../../components/poster dashboard/ListingForm";
import { EMPTY_LISTING } from "../../components/poster dashboard/data/listingForm";
import { createListing } from "../../api/listings";
import { POSTER } from "../../paths";

function NewListingContent() {
  const navigate = useNavigate();

  async function save(body) {
    const { listing } = await createListing(body);
    navigate(POSTER.listings, { state: { created: listing.title } });
  }

  return (
    <ListingForm
      initialValues={EMPTY_LISTING}
      heading="New listing"
      intro="Tenants see these details. The area, building and unit number are checked so the same unit can't be listed twice."
      submitLabel="Publish listing"
      savingLabel="Publishing…"
      onSave={save}
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
