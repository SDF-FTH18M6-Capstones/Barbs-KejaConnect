import { formatKES, formatDate } from "./data/formart";
import { Link } from "react-router-dom";

function HouseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

export default function InquiryCard({ inquiry }) {
  const p = inquiry.property;
  const available = p.status === "available";

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:p-5">
      <div className="grid h-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary/10 text-primary-dark sm:w-32">
        {p.cover_image ? (
          <img
            src={p.cover_image}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <HouseIcon />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            to={`/listings/${p.id}`}
            className="text-base font-semibold text-text hover:text-primary"
          >
            {p.title}
          </Link>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              available ? "bg-success/10 text-success" : "bg-border text-text"
            }`}
          >
            {available ? "Listing available" : "Listing taken"}
          </span>
        </div>

        <p className="text-sm text-text-muted">
          {p.building_name} {p.unit_number}, {p.area} · {formatKES(p.rent_kes)}{" "}
          / month · to {p.poster_name}
        </p>

        <p className="rounded-lg bg-bg px-3 py-2.5 text-[15px] leading-relaxed text-text">
          {inquiry.message}
        </p>

        <p className="text-[13px] text-text-muted">
          Sent {formatDate(inquiry.created_at)}
        </p>
      </div>
    </article>
  );
}
