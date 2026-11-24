import { useEffect, useId, useMemo } from "react";
import { MAX_PHOTOS, MAX_PHOTO_MB, checkPhoto } from "./data/listingForm";

function Thumb({ src, label, cover, onRemove, removeLabel, busy }) {
  return (
    <li className="relative overflow-hidden rounded-xl border border-border bg-bg">
      <img src={src} alt={label} className="aspect-[4/3] w-full object-cover" />
      {cover && (
        <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-text-on-primary">
          Cover
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        disabled={busy}
        aria-label={removeLabel}
        className="absolute right-2 top-2 min-h-8 rounded-lg bg-surface/90 px-2.5 text-xs font-medium text-error hover:bg-surface disabled:opacity-60"
      >
        {busy ? "Removing…" : "Remove"}
      </button>
    </li>
  );
}

export default function PhotoPicker({
  existing = [],
  files,
  onFilesChange,
  onRemoveExisting,
  removingId = null,
  error = "",
  onError,
  disabled = false,
}) {
  const id = useId();
  const total = existing.length + files.length;
  const left = MAX_PHOTOS - total;

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );
  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews],
  );

  function choose(e) {
    const chosen = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (chosen.length === 0) return;

    const problem = chosen.map(checkPhoto).find(Boolean);
    if (problem) {
      onError(problem);
      return;
    }
    if (chosen.length > left) {
      onError(
        `You can add ${left} more ${left === 1 ? "photo" : "photos"} (up to ${MAX_PHOTOS}).`,
      );
      return;
    }
    onError("");
    onFilesChange([...files, ...chosen]);
  }

  function removeNew(index) {
    onError("");
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <p id={`${id}-hint`} className="text-[13px] text-text-muted">
        JPG, PNG or WEBP, up to {MAX_PHOTO_MB} MB each, {MAX_PHOTOS} photos at
        most. The first photo is the cover tenants see first.
      </p>

      {total > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {existing.map((img, i) => (
            <Thumb
              key={`saved-${img.id}`}
              src={img.url}
              label={`Saved photo ${i + 1}`}
              cover={i === 0}
              busy={removingId === img.id}
              removeLabel={`Remove saved photo ${i + 1}`}
              onRemove={() => onRemoveExisting(img)}
            />
          ))}
          {files.map((file, i) => (
            <Thumb
              key={previews[i]}
              src={previews[i]}
              label={file.name}
              cover={existing.length === 0 && i === 0}
              removeLabel={`Remove ${file.name}`}
              onRemove={() => removeNew(i)}
            />
          ))}
        </ul>
      )}

      <input
        id={id}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={choose}
        disabled={disabled || left <= 0}
        aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-5 text-center ${
          error ? "border-error" : "border-border hover:border-primary"
        } ${disabled || left <= 0 ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <span className="font-medium text-primary">
          {total === 0 ? "Add photos" : "Add more photos"}
        </span>
        <span className="text-[13px] text-text-muted">
          {left > 0
            ? `${total} of ${MAX_PHOTOS} added`
            : `You've added the most photos (${MAX_PHOTOS})`}
        </span>
      </label>

      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
