import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/format";

const STATUS = {
  new: { lable: "New", className: "bg-primary/10 text-primary-dark" },
  responded: { lable: "Responded", className: "bg-success/10 text-success" },
  closed: { lable: "Closed", className: "bg-border text-text-muted" },
};

const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function ReceivedInquiry({ inquiry }) {
  const { tenant, property } = inquiry;
  const status = STATUS[inquiry.status] ?? STATUS.new;
  const isNew = inquiry.status === "new";
  const action =
    "inline-flex min-h-9 items-center rounded-lg border border-border px-3 text-sm font-medium text-text hover:bg-bg";

  return (
    <article
      className={`flex gap-3 rounded-xl border p-4 ${
        isNew ? "border-primary/20 bg-primary/5" : "border-border bg-surface"
      }`}
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-bg text-sm font-semibold"
      >
        {initials(tenant?.full_name)}
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[15px]">
            <strong className="font-semibold">{tenant?.full_name}</strong>{" "}
            <span className="text-text-muted">about </span>
            <Link
              to={`/listings/${property.id}`}
              className="font-medium text-primary hover:text-primary-dark"
            >
              {property.title}
            </Link>
          </p>
          <span className="flex items-center gap-2 text-[13px] text-text-muted">
            {timeAgo(inquiry.created_at)}
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </span>
        </div>

        <p className="text-sm leading-relaxed">{inquiry.message}</p>

        {tenant && (
          <div className="flex flex-wrap gap-2">
            {tenant.phone && (
              <a
                href={`tel:${tenant.phone.replace(/\s/g, "")}`}
                className={action}
              >
                Call {tenant.phone}
              </a>
            )}
            {tenant.email && (
              <a
                href={`mailto:${tenant.email}?subject=${encodeURIComponent(`Re: ${property.title}`)}`}
                className={action}
              >
                Email {tenant.full_name.split(" ")[0]}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
