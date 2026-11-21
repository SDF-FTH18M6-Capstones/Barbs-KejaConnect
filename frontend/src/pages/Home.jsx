import { useEffect, useMemo, useState } from "react";
import Hero from "../components/home/Hero";
import FilterSidebar from "../components/home/FilterSidebar";
import ListingGrid from "../components/home/ListingGrid";
import Pagination from "../components/home/Pagination";
import { getListings, getAreas } from "../api/listings";
import { PROPERTY_TYPES } from "../utils/labels";
import useDebounce from "../utils/useDebounce";
import { useListings } from "../providers/ListingsProvider";

const PAGE_SIZE = 9;

const EMPTY = { area: "", property_type: "", min: "", max: "" };

export default function Home() {
  const { listingsData, setPage } = useListings();
  const { items, page, per_page, total, pages, loading, error } = listingsData;
  const [filters, setFilters] = useState(EMPTY);

  const [retry, setRetry] = useState(0);

  const [areas, setAreas] = useState([]);
  const [totalAvailable, setTotalAvailable] = useState(null);

  const query = useMemo(() => ({ ...filters, page }), [filters, page]);

  const updateFilters = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };
  const reset = () => {
    setFilters(EMPTY);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <Hero unitCount={total} areaCount={areas.length} />
      <main className="mx-auto flex max-w-[1200px] flex-wrap items-start gap-6 px-6 pb-14 pt-7">
        <FilterSidebar
          filters={filters}
          areas={areas}
          types={PROPERTY_TYPES}
          onChange={updateFilters}
          onReset={reset}
        />
        <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-[18px]">
          <ListingGrid
            items={items}
            total={total}
            status={loading}
            error={error}
            onRetry={() => setRetry((n) => n + 1)}
          />
          {loading !== "error" && (
            <Pagination page={page} pageCount={pages} onPage={setPage} />
          )}
        </section>
      </main>
    </div>
  );
}
