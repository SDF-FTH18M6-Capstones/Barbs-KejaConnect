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
    <article>
      <div>
        {p.cover_image ? <img src={p.cover_image} alt="" /> : <HouseIcon />}
      </div>
      <div>
        <div>
          <Link to={`/listings/${p.id}`}>{p.title}</Link>
          <span>{available ? "Listing Available" : "listing taken"}</span>
        </div>
        <p>
          {p.building_name} {p.unit_number}, {p.area} · {formatKES(p.rent_kes)}{" "}
          / month · to {p.poster_name}
        </p>
        <p> {inquiry.message} </p>
        <p> Sent {formatDate(inquiry.created_at)} </p>
      </div>
    </article>
  );
}
