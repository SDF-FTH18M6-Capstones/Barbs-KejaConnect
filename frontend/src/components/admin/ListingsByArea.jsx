function ListingsByArea({ areas = [], totalAreas }) {
  const max = Math.max(...areas.map((a) => a.count), 1);

  return (
    <section className="rounded-xl border border-[#E1E5E0] bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-[#16211C]">
        Listings by area
      </h2>

      <ul className="space-y-3">
        {areas.map((area) => (
          <li key={area.name} className="flex items-center gap-3 text-xs">
            <span className="w-20 shrink-0 text-[#16211C]">{area.name}</span>
            <div className="h-2 flex-1 rounded-full bg-[#EEF1ED]">
              <div
                className="h-2 rounded-full bg-[#0E6B4E]"
                style={{ width: `${(area.count / max) * 100}%` }}
              />
            </div>
            <span className="w-4 text-right text-[#16211C]">{area.count}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-[#56625B]">
        Top {areas.length} of {totalAreas ?? areas.length} areas.
      </p>
    </section>
  );
}

export default ListingsByArea;
