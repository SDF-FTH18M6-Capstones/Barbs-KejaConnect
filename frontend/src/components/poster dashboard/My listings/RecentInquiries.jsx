import { Link } from "react-router-dom";
import { formatDate } from "../../inquiries/data/formart";

const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function RecentInquiries({ inquiries }) {
  return (
    <section className="space-y-3 rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Recent inquiries</h2>
        <Link
          to="/dashboard/inquiries"
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
        inquiries.map((q) => (
          <article
            key={q.id}
            className={`flex gap-3 rounded-xl p-3 ${q.is_read ? "border border-border" : "border border-primary/20 bg-primary/10"}`}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bg text-sm font-semibold">
              {initials(q.tenant_name)}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[15px]">
                  <strong className="font-semibold">{q.tenant_name}</strong>{" "}
                  <span className="text-text-muted">
                    about {q.property.building_name} {q.property.unit_number}
                  </span>
                </p>
                <span className="text-[13px] text-text-muted">
                  {formatDate(q.created_at)}
                  {!q.is_read && " · New"}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{q.message}</p>
              {!q.is_read && (
                <a
                  href={`tel:${q.tenant_phone.replace(/\s/g, "")}`}
                  className="text-sm font-medium text-primary hover:text-primary-dark"
                >
                  Reply to {q.tenant_phone}
                </a>
              )}
            </div>
          </article>
        ))
      )}
    </section>
  );
}
