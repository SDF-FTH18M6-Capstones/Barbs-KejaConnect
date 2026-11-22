import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "./Field";
import PhotoPicker from "./PhotoPicker";
import {
  COUNTIES,
  DESCRIPTION_MAX,
  NO_BEDROOM_TYPES,
  serverFieldErrors,
  toListingBody,
  validateListing,
} from "./data/listingForm";
import { getAreas } from "../../api/listings";
import { PROPERTY_TYPES } from "../../utils/labels";
import { POSTER } from "../../paths";

function Section({ title, children }) {
  return (
    <fieldset className="space-y-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <h2 aria-hidden="true" className="text-lg font-semibold">
        {title}
      </h2>
      {children}
    </fieldset>
  );
}

export default function ListingForm({
  initialValues,
  heading,
  intro,
  submitLabel,
  savingLabel,
  onSave,
  existingPhotos = [],
  onRemovePhoto,
}) {
  const [values, setValues] = useState(initialValues);
  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [areas, setAreas] = useState({ county: "", items: [] });
  const [errors, setErrors] = useState({});
  const [duplicate, setDuplicate] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const busy = saving;
  const noBedroom = NO_BEDROOM_TYPES.includes(values.property_type);
  const commercial = values.property_type === "commercial";
  const isHouse = values.property_type === "house";

  function applyServerError(err) {
    if (err.code === "DUPLICATE_LISTING" || err.status === 409)
      setDuplicate(err.details ?? {});
    else if (err.code === "VALIDATION_ERROR" && err.details)
      setErrors(serverFieldErrors(err.details));
    else if (err.code === "ACCOUNT_NOT_APPROVED")
      setFormError(
        "Your account is not approved yet, so you can't manage listings.",
      );
    else if (err.status === 403)
      setFormError("You can only edit your own listings.");
    else setFormError(err.message || "Could not save the listing. Try again.");
  }

  useEffect(() => {
    if (!values.county) return;
    let cancelled = false;
    getAreas({ county: values.county })
      .then((data) => {
        if (!cancelled)
          setAreas({ county: values.county, items: data.items ?? [] });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [values.county]);

  const areaSuggestions = areas.county === values.county ? areas.items : [];

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({
      ...v,
      [name]: value,
      ...(name === "county" ? { area: "" } : {}),
    }));
    setErrors((er) => ({
      ...er,
      [name]: "",
      ...(name === "county" ? { area: "" } : {}),
    }));
    if (
      [
        "county",
        "area",
        "building_name",
        "street_address",
        "unit_number",
      ].includes(name)
    ) {
      setDuplicate(null);
    }
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateListing(values);
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
      await onSave(toListingBody(values), photos);
    } catch (err) {
      applyServerError(err);
      setSaving(false);
    }
  }

  async function removeSaved(image) {
    setPhotoError("");
    setRemovingId(image.id);
    try {
      await onRemovePhoto(image);
    } catch (err) {
      setPhotoError(err.message || "Could not remove the photo. Try again.");
    } finally {
      setRemovingId(null);
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
    <form noValidate onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div className="space-y-1">
        <Link
          to={POSTER.listings}
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          ← My listings
        </Link>
        <h1 className="text-3xl font-semibold">{heading}</h1>
        <p className="text-text-muted">{intro}</p>
      </div>

      <Section title="The unit">
        <Field
          label="Title"
          hint="e.g. Spacious 2 bedroom with balcony"
          error={errors.title}
        >
          {input("title", { maxLength: 80 })}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
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
          <Field label="Monthly rent (KES)" error={errors.price_monthly}>
            {input("price_monthly", {
              inputMode: "numeric",
              placeholder: "25000",
            })}
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
      </Section>

      <Section title="Location">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="County" error={errors.county}>
            {(props) => (
              <select
                {...props}
                name="county"
                value={values.county}
                onChange={handleChange}
              >
                <option value="">Choose a county</option>
                {COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field
            label="Area"
            hint="Estate or neighbourhood, e.g. Kilimani"
            error={errors.area}
          >
            {(props) => (
              <>
                <input
                  {...props}
                  name="area"
                  list="area-suggestions"
                  value={values.area}
                  onChange={handleChange}
                  disabled={!values.county}
                  placeholder={
                    values.county ? "Kilimani" : "Choose a county first"
                  }
                />
                <datalist id="area-suggestions">
                  {areaSuggestions.map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
              </>
            )}
          </Field>
          <Field
            label="Building or estate"
            optional={isHouse}
            error={errors.building_name}
          >
            {input("building_name", { placeholder: "Jabavu Court" })}
          </Field>
          <Field
            label="Street address"
            optional={!isHouse}
            error={errors.street_address}
          >
            {input("street_address", { placeholder: "Argwings Kodhek Rd" })}
          </Field>
          <Field
            label="Unit number"
            hint="As written on the door, e.g. B4"
            error={errors.unit_number}
          >
            {input("unit_number")}
          </Field>
          <Field
            label="LR number"
            optional
            hint="Land reference number on the title deed"
            error={errors.lr_number}
          >
            {input("lr_number")}
          </Field>
        </div>

        {duplicate && (
          <div
            role="alert"
            className="space-y-1 rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error"
          >
            <p className="font-semibold">This unit is already listed</p>
            <p>
              {duplicate.poster_name
                ? `${duplicate.poster_name} has`
                : "Someone has"}{" "}
              already posted this area, building/street and unit. Check the unit
              number, or report the listing if you manage this unit.
            </p>
            {duplicate.existing_listing_id && (
              <Link
                to={`/listings/${duplicate.existing_listing_id}`}
                className="font-medium underline"
              >
                View the existing listing
              </Link>
            )}
          </div>
        )}
      </Section>

      <Section title="Description">
        <Field
          label="Description"
          hint={`${values.description.trim().length} of ${DESCRIPTION_MAX} characters. Mention water, parking, security and what is nearby.`}
          error={errors.description}
        >
          {(props) => (
            <textarea
              {...props}
              name="description"
              rows={5}
              value={values.description}
              onChange={handleChange}
            />
          )}
        </Field>
      </Section>

      <Section title="Photos">
        <PhotoPicker
          existing={existingPhotos}
          files={photos}
          onFilesChange={setPhotos}
          onRemoveExisting={removeSaved}
          removingId={removingId}
          error={photoError}
          onError={setPhotoError}
          disabled={busy}
        />
      </Section>

      {formError && (
        <p
          role="alert"
          className="rounded-lg bg-error/10 p-3 text-sm text-error"
        >
          {formError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-text-on-primary hover:bg-primary-dark disabled:opacity-60"
        >
          {busy ? savingLabel : submitLabel}
        </button>

        <Link
          to={POSTER.listings}
          className="rounded-lg border border-border bg-surface px-6 py-3 font-medium text-text hover:bg-bg"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
