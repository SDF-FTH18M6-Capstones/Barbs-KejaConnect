import { useEffect, useMemo, useState } from "react";
import FilterSidebar from "../components/FilterSidebar";

const PAGE_SIZE = 9;
const EMPTY = { area: "", property_type: "", min: "", max: "" };

export default function Home() {
  const [filters, setFilters] = useState(EMPTY);
  const [page, setPage] = useState(1);

  const [data, setData] = useState({ items: [], total: 0, pages: 0 });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  // Dropdown options and the hero numbers. Fetched once.
  const [areas, setAreas] = useState([]);
  const [totalAvailable, setTotalAvailable] = useState(null);

  useEffect(() => {
    let ignore = false;
    Promise.all([getAreas(), getListings({ per_page: 1 })])
      .then(([a, l]) => {
        if (!ignore) {
          setAreas(a.items);
          setTotalAvailable(l.total);
        }
      })
      .catch(() => {}); // not critical: dropdown stays at "All areas", hero hides the count
    return () => {
      ignore = true;
    };
  }, []);

  // Wait until the user stops typing before calling the API.
  const query = useMemo(() => ({ ...filters, page }), [filters, page]);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    let ignore = false; // drop answers from outdated requests
    setStatus("loading");
    getListings({
      page: debounced.page,
      per_page: PAGE_SIZE,
      area: debounced.area,
      property_type: debounced.property_type,
      min_price: debounced.min,
      max_price: debounced.max,
    })
      .then((d) => {
        if (ignore) return;
        // Out-of-range page returns empty items (not an error): step back.
        if (
          d.items.length === 0 &&
          d.total > 0 &&
          d.pages > 0 &&
          debounced.page > d.pages
        ) {
          setPage(d.pages);
          return;
        }
        setData(d);
        setError(null);
        setStatus("ready");
      })
      .catch((e) => {
        if (!ignore) {
          setError(e);
          setStatus("error");
        }
      });
    return () => {
      ignore = true;
    };
  }, [debounced, retry]);

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
      <Navbar />
      <Hero unitCount={totalAvailable} areaCount={areas.length} />
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
            items={data.items}
            total={data.total}
            status={status}
            error={error}
            onRetry={() => setRetry((n) => n + 1)}
          />
          {status !== "error" && (
            <Pagination page={page} pageCount={data.pages} onPage={setPage} />
          )}
        </section>
      </main>
    </div>
  );
}
