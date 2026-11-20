import { Link } from "react-router-dom";
import { formatDate } from "../inquiries/data/formart";
import { POSTER } from "../../paths";

export default function ListingsTable({ listings, onToggle, busyId }) {
  const button =
    "min-h-9 rounded-lg border border-text-muted/40 bg-surface px-3 text-sm font-medium text-text hover:bg-bg disabled:opacity-60";

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-[13px] text-text-muted">
            <th className="px-4 py-2.5 font-medium">Listing</th>
            <th className="px-4 py-2.5 font-medium">Unit</th>
            <th className="px-4 py-2.5 font-medium">Rent (KES)</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Posted</th>
            <th className="px-4 py-2.5 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => {
            const taken = l.status === "taken";
            return (
              <tr key={l.id} className="border-b border-border/60 text-sm">
                <td className="px-4 py-3">
                  <Link
                    to={`/listings/${l.id}`}
                    className="font-medium text-text hover:text-primary"
                  >
                    {l.title}
                  </Link>
                  <div className="text-[13px] text-text-muted">{l.area}</div>
                </td>
                <td className="px-4 py-3">
                  {l.building_name} {l.unit_number ?? ""}
                </td>
                <td className="px-4 py-3">
                  {Number(l.price_monthly ?? l.rent_kes).toLocaleString(
                    "en-KE",
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      taken
                        ? "bg-border text-text"
                        : "bg-success/10 text-success"
                    }`}
                  >
                    {taken ? "Taken" : "Available"}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {formatDate(l.created_at)}
                </td>
                <td className="space-x-2 whitespace-nowrap px-4 py-3 text-right">
                  <Link
                    to={POSTER.editListing(l.id)}
                    className={`${button} inline-flex items-center`}
                  >
                    Edit
                  </Link>
                  <button
                    className={button}
                    disabled={busyId === l.id}
                    onClick={() => onToggle(l)}
                  >
                    {taken ? "Mark available" : "Mark as taken"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
