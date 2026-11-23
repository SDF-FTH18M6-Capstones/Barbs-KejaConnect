import { useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLoad from "../../components/poster dashboard/useLoad";
import {
  DESCRIPTION_MAX,
  EMPTY_LISTING,
  NO_BEDROOM_TYPES,
  serverFieldErrors,
  toListingBody,
  validateListing,
} from "../../components/poster dashboard/data/listingForm";
import { createListing, getAreas } from "../../api/listings";
import { PROPERTY_TYPES } from "../../utils/labels";
import { ADMIN } from "../../paths";

// Deposit, furnished and amenities are not stored by the backend yet.
// Set to true once the API accepts them.
const SEND_EXTRAS = false;

const AMENITIES = [
  "Parking",
  "Lift",
  "Backup generator",
  "Borehole",
  "Gym",
  "Swimming pool",
  "CCTV",
  "DSQ",
];

// Local copy of the field wrapper so the shared one stays untouched
function Field({ label, hint, error, optional, children }) {
  const id = useId();
  const inputClass = `w-full rounded-md border bg-surface px-3 py-2 text-sm text-text outline-none transition focus:ring-2 disabled:bg-bg disabled:text-text-muted ${
    error
      ? "border-error focus:ring-error/20"
      : "border-border focus:border-primary focus:ring-primary/20"
  }`;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-medium text-text">
        {label}
        {optional && (
          <span className="font-normal text-text-muted"> (optional)</span>
        )}
      </label>
      {children({
        id,
        className: inputClass,
        "aria-invalid": error ? true : undefined,
      })}
      {error && <p className="text-xs text-error">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <fieldset className="space-y-4 rounded-lg border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      {children}
    </fieldset>
  );
}

export default function AdminNewListing() {
  const navigate = useNavigate();
  const areas = useLoad(getAreas);

  const [values, setValues] = useState({
    ...EMPTY_LISTING,
    deposit: "",
    furnished: "no",
  });
  const [amenities, setAmenities] = useState([]);
  const [errors, setErrors] = useState({});
  const [duplicate, setDuplicate] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const noBedroom = NO_BEDROOM_TYPES.includes(values.property_type);
  const commercial = values.property_type === "commercial";
  const dupMark = duplicate ? " " : "";

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: "" }));
    if (["area", "building_name", "unit_number"].includes(name))
      setDuplicate(null);
    setFormError("");
  }

  function toggleAmenity(name) {
    setAmenities((list) =>
      list.includes(name) ? list.filter((a) => a !== name) : [...list, name],
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateListing(values);

    const deposit = Number(values.deposit);
    if (
      !/^\d+$/.test(values.deposit.trim()) ||
      deposit < 1 ||
      deposit > 1000000
    ) {
      found.deposit = "Enter a deposit between 1 and 1,000,000.";
    }

    setErrors(found);
    setDuplicate(null);
    setFormError("");
    if (Object.keys(found).length > 0) {
      e.currentTarget
        .querySelector(`[name="${Object.keys(found)[0]}"]`)
        ?.focus();
      return;
    }

    setSaving(true);
    try {
      const body = toListingBody(values);
      if (SEND_EXTRAS) {
        body.deposit = deposit;
        body.furnished = values.furnished === "yes";
        body.amenities = amenities;
      }
      await createListing(body);
      navigate(ADMIN.home);
    } catch (err) {
      if (err.code === "DUPLICATE_LISTING") setDuplicate(err.details ?? {});
      else if (err.code === "VALIDATION_ERROR" && err.details)
        setErrors(serverFieldErrors(err.details));
      else
        setFormError(err.message || "Could not save the listing. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const input =
    (name, extra = {}) =>
    (props) => (
      <input
        {...props}
        name={name}
        value={values[name]}
        onChange={handleChange}
        {...extra}
      />
    );

  return (
    <div className="min-h-screen bg-bg p-6 text-text">
      <form noValidate onSubmit={handleSubmit} className="max-w-3xl space-y-4">
        <div className="space-y-1">
          <p className="text-xs text-text-muted">
            Step 1 of 2 · Details, then photos
          </p>
          <h1 className="text-2xl font-semibold">New listing</h1>
        </div>

        {duplicate && (
          <div
            role="alert"
            className="flex gap-3 rounded-lg border border-error/30 bg-error/10 p-4"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-error text-xs font-bold text-error"
            >
              !
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-error">
                This unit is already listed
              </p>
              <p className="text-xs">
                {[values.area, values.building_name]
                  .filter(Boolean)
                  .join(" · ")}{" "}
                · unit {values.unit_number.toUpperCase()} was listed by{" "}
                <strong>{duplicate.poster_name ?? "another poster"}</strong>
                {duplicate.company && ` (${duplicate.company})`}
                {duplicate.listed_at && ` on ${duplicate.listed_at}`}. Each unit
                can only be listed once.
              </p>
              <p className="text-xs">
                {duplicate.existing_listing_id && (
                  <>
                    <Link
                      to={`/listings/${duplicate.existing_listing_id}`}
                      className="font-medium underline"
                    >
                      View the existing listing
                    </Link>
                    {" · "}
                  </>
                )}
                <a href="#report" className="font-medium underline">
                  Report a problem
                </a>
              </p>
            </div>
          </div>
        )}

        <Section title="Location">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field
              label="Area"
              error={
                errors.area ||
                (areas.error && "Could not load the areas. Reload the page.") ||
                dupMark
              }
            >
              {(props) => (
                <select
                  {...props}
                  name="area"
                  value={values.area}
                  onChange={handleChange}
                  disabled={areas.loading}
                >
                  <option value="">
                    {areas.loading ? "Loading areas…" : "Choose an area"}
                  </option>
                  {areas.data?.items.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field
              label="Building name"
              error={errors.building_name || dupMark}
            >
              {input("building_name", { placeholder: "Jabavu Court" })}
            </Field>
            <Field label="Unit number" error={errors.unit_number || dupMark}>
              {input("unit_number")}
            </Field>
            <Field label="LR number" optional error={errors.lr_number}>
              {input("lr_number")}
            </Field>
          </div>
          <p className="text-xs text-text-muted">
            We match area, building and unit regardless of capitals or extra
            spaces.
          </p>
        </Section>

        <Section title="Details">
          <Field label="Title" error={errors.title}>
            {input("title", { maxLength: 80 })}
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Property type" error={errors.property_type}>
              {(props) => (
                <select
                  {...props}
                  name="property_type"
                  value={values.property_type}
                  onChange={handleChange}
                >
                  <option value="">Choose a type</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            {!noBedroom && (
              <Field
                label="Bedrooms"
                optional={commercial}
                error={errors.bedrooms}
              >
                {input("bedrooms", { inputMode: "numeric" })}
              </Field>
            )}
            <Field
              label="Bathrooms"
              optional={commercial}
              error={errors.bathrooms}
            >
              {input("bathrooms", { inputMode: "numeric" })}
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Rent per month (KES)" error={errors.price_monthly}>
              {input("price_monthly", {
                inputMode: "numeric",
                placeholder: "25000",
              })}
            </Field>
            <Field label="Deposit (KES)" error={errors.deposit}>
              {input("deposit", { inputMode: "numeric" })}
            </Field>
            <div className="space-y-1">
              <span className="block text-xs font-medium">Furnished</span>
              <div className="flex items-center gap-4 pt-2 text-sm">
                {["yes", "no"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="furnished"
                      value={opt}
                      checked={values.furnished === opt}
                      onChange={handleChange}
                      className="accent-primary"
                    />
                    {opt === "yes" ? "Yes" : "No"}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Field
            label="Description"
            hint={`At least 20 characters (${values.description.trim().length} of ${DESCRIPTION_MAX}).`}
            error={errors.description}
          >
            {(props) => (
              <textarea
                {...props}
                name="description"
                rows={3}
                value={values.description}
                onChange={handleChange}
              />
            )}
          </Field>
        </Section>

        <Section title="Amenities">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
            {AMENITIES.map((name) => (
              <label key={name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={amenities.includes(name)}
                  onChange={() => toggleAmenity(name)}
                  className="accent-primary"
                />
                {name}
              </label>
            ))}
          </div>
        </Section>

        {formError && (
          <p
            role="alert"
            className="rounded-lg bg-error/10 p-3 text-sm text-error"
          >
            {formError}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <Link
            to={ADMIN.home}
            className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-bg"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-on-primary hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save and add photos"}
          </button>
        </div>
      </form>
    </div>
  );
}
