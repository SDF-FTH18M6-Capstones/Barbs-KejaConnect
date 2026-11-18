import { Link } from "react-router-dom";
import ReceivedInquiry from "../ReceivedInquiry";
import { POSTER } from "../../../paths";

export default function RecentInquiries({ inquiries }) {
  return (
    <section className="space-y-3 rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Recent inquiries</h2>
        <Link
          to={POSTER.inquiries}
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          View all
        </Link>
      </div>

      {inquiries.length === 0 ? (
        <p className="text-sm text-text-muted">
          No inquiries yet. They'll show here when tenants message you.
        </p>
      ) : (
        inquiries.map((q) => <ReceivedInquiry key={q.id} inquiry={q} />)
      )}
    </section>
  );
}
