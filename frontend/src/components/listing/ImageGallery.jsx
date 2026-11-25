import { useRef, useState } from "react";

const TINTS = ["#DDF0E7", "#E4ECF6", "#F6EBDA", "#EDE7F4", "#E3EFE9"];
const MAX_TILES = 5;

function tileClass(i, n) {
  if (n === 1) return "col-span-4 row-span-2";
  if (i === 0) return "col-span-2 row-span-2";
  if (n === 2) return "col-span-2 row-span-2";
  if (n === 3) return "col-span-2";
  if (n === 4 && i === 1) return "col-span-2";
  return "";
}

function Tile({ image, index, alt, className = "" }) {
  return image.url ? (
    <img src={image.url} alt={alt} loading={index === 0 ? "eager" : "lazy"}
      className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-brand-dark ${className}`}
      style={{ background: TINTS[index % TINTS.length] }}>
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M21 16l-5-5-8 8" />
      </svg>
      {index === 0 ? "Cover photo" : `Photo ${index + 1}`}
    </div>
  );
}

export default function ImageGallery({ images, title }) {
  const dialogRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const sorted = [...images].sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.position - b.position);

  if (sorted.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-[14px] border border-line bg-white text-muted sm:h-[400px]">
        No photos yet
      </div>
    );
  }

  const shown = sorted.slice(0, MAX_TILES);
  const extra = sorted.length - MAX_TILES;
  const open = (i) => { setCurrent(i); dialogRef.current?.showModal(); };
  const step = (d) => setCurrent((c) => (c + d + sorted.length) % sorted.length);

  return (
    <>
      <div className="grid h-[260px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[14px] sm:h-[400px]">
        {shown.map((img, i) => (
          <button key={img.id} type="button" onClick={() => open(i)}
            aria-label={`View photo ${i + 1} of ${sorted.length}`}
            className={`relative overflow-hidden p-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand ${tileClass(i, shown.length)}`}>
            <Tile image={img} index={i} alt={`${title}, photo ${i + 1}`} />
            {i === MAX_TILES - 1 && extra > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/70 text-sm font-medium text-white">
                +{extra} more photos
              </span>
            )}
          </button>
        ))}
      </div>

      <dialog ref={dialogRef} aria-label="Photo viewer"
        onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}
        className="m-auto w-[min(92vw,900px)] rounded-[14px] bg-white p-3 backdrop:bg-ink/70">
        <div className="h-[55vh] overflow-hidden rounded-[10px]">
          <Tile image={sorted[current]} index={current} alt={`${title}, photo ${current + 1}`} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button type="button" onClick={() => step(-1)}
            className="min-h-11 rounded-[10px] border border-line-strong px-4 font-medium hover:bg-canvas">Previous</button>
          <span className="text-sm text-muted" aria-live="polite">{current + 1} / {sorted.length}</span>
          <button type="button" onClick={() => step(1)}
            className="min-h-11 rounded-[10px] border border-line-strong px-4 font-medium hover:bg-canvas">Next</button>
          <button type="button" onClick={() => dialogRef.current?.close()}
            className="min-h-11 rounded-[10px] border border-brand bg-brand px-4 font-medium text-white hover:bg-brand-dark">Close</button>
        </div>
      </dialog>
    </>
  );
}