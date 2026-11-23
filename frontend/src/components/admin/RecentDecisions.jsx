import StatusBadge from "./StatusBadge";

function RecentDecisions({ decisions = [] }) {
  return (
    <section className="rounded-xl border border-[#E1E5E0] bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-[#16211C]">
        Recent decisions
      </h2>

      <ul className="space-y-4">
        {decisions.map((d) => (
          <li key={d.id} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#16211C]">{d.name}</p>
              <p className="text-xs text-[#56625B]">
                {d.note}
                {d.date && ` · ${d.date}`}
              </p>
            </div>
            <StatusBadge status={d.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RecentDecisions;
