import { Link } from "react-router-dom";

export default function EmptyInquiries() {
  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-text-muted/40 bg-surface p-8 text-center">
      <p className="text-lg font-semibold text-text">
        Find a place you like and ask the poster about it
      </p>
      <p className="text-sm text-text-muted">
        Your inquiries will show up here.
      </p>
      <Link
        to="/listings"
        className="inline-block rounded-lg bg-primary px-5 py-2.5 font-medium text-text-on-primary hover:bg-primary-dark"
      >
        Browse listings
      </Link>
    </div>
  );
}
