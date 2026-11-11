const field =
  "min-h-11 w-full rounded-[10px] border border-line-strong bg-white px-3 py-2.5 text-[15px] text-ink focus:outline-2 focus:outline-offset-2 focus:outline-brand";

export default function FilterSidebar({ filters, areas, types, onChange, onReset }) {
  return (
    <aside className="flex max-w-full flex-[1_1_260px] flex-col gap-[18px] rounded-[14px] border border-line bg-white p-5">
      <h2 className="font-display text-lg font-semibold">Filters</h2>

      <div>
        <label htmlFor="area" className="mb-1.5 block text-sm font-medium">
          Area
        </label>
        <select
          id="area"
          className={field}
          value={filters.area}
          onChange={(e) => onChange({ area: e.target.value })}
        >
          <option value="">All areas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="type" className="mb-1.5 block text-sm font-medium">
          Property type
        </label>
        <select
          id="type"
          className={field}
          value={filters.property_type}
          onChange={(e) => onChange({ property_type: e.target.value })}
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-1.5 block text-sm font-medium">
          Rent per month (KES)
        </legend>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="pmin" className="text-[13px] text-muted">
              Min
            </label>
            <input
              id="pmin"
              inputMode="numeric"
              placeholder="0"
              className={field}
              value={filters.min}
              onChange={(e) =>
                onChange({ min: e.target.value.replace(/\D/g, "") })
              }
            />
          </div>
          <div>
            <label htmlFor="pmax" className="text-[13px] text-muted">
              Max
            </label>
            <input
              id="pmax"
              inputMode="numeric"
              placeholder="No limit"
              className={field}
              value={filters.max}
              onChange={(e) =>
                onChange({ max: e.target.value.replace(/\D/g, "") })
              }
            />
          </div>
        </div>
      </fieldset>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-line-strong bg-white px-[18px] font-medium text-ink hover:bg-canvas"
      >
        Clear filters
      </button>
    </aside>
  );
}
