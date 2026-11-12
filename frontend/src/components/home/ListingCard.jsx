import { Link } from "react-router-dom";
import { formatKES, timeAgo } from "../../utils/format";
import { roomsLabel } from "../../utils/labels";

const TINTS = ["#DDF0E7", "#E4ECF6", "#F6EBDA", "#EDE7F4"];

export default function ListingCard({ listing, index = 0 }) {
  const {
    id,
    title,
    area,
    building_name,
    price_monthly,
    created_at,
    cover_image_url,
    poster,
  } = listing;

  return (
    <Link
      to="/"
      className="flex flex-col overflow-hidden rounded-[14px] border border-line bg-white text-ink no-underline transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div
        className="relative flex h-40 items-center justify-center"
        style={{ background: TINTS[index % TINTS.length] }}
      >
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={`${title} in ${area}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <svg
            aria-hidden="true"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0A5039"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 11l9-7 9 7" />
            <path d="M5 10v10h14V10" />
            <path d="M10 20v-6h4v6" />
          </svg>
        )}
        {poster?.is_verified && (
          <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white px-[9px] py-[3px] text-xs font-medium text-brand-dark">
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0A5039"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
            Verified poster
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 px-4 pb-4 pt-3.5">
        <div className="font-display text-xl font-semibold">
          KES {formatKES(price_monthly)}
          <span className="font-sans text-sm font-normal text-muted">
            {" "}
            / month
          </span>
        </div>
        <div className="text-[15px] font-medium leading-snug">{title}</div>
        <div className="text-sm text-muted">
          {building_name} · {area}
        </div>
        <div className="mt-1 flex justify-between border-t border-line pt-1.5 text-[13px] text-muted">
          <span>{roomsLabel(listing)}</span>
          <span>{timeAgo(created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
