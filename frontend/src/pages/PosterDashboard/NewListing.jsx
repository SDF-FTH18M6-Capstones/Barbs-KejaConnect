import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PosterGate from "../../components/poster dashboard/PosterGate";
import Field from "../../components/poster dashboard/Field";
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

function Section({ title, children }) {
  return (
    <fieldset className="space-y-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h2 aria-hidden="true" className="text-lg font-semibold">
        {title}
      </h2>
      {children}
    </fieldset>
  );
}

function NewListingForm() {
  const navigate = useNavigate();
  const areas = useLoad(getAreas);

  const [values, setValues] = useState(EMPTY_LISTING);
  const [errors, setErrors] = useState({});
  const [duplicate, setDuplicate] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const noBedroom = NO_BEDROOM_TYPES.includes(values.property_type);
  const commercial = values.property_type === "commercial";

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: "" }));
    if (["area", "building_name", "unit_number"].includes(name))
      setDuplicate(null);
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateListing(values);
    setErrors(found);
    setDuplicate(null);
    setFormError("");
    if (Object.keys(found).length > 0) {
      // Move focus to the first field with a problem
      e.currentTarget
        .querySelector(`[name="${Object.keys(found)[0]}"]`)
        ?.focus();
      return;
    }
    setSaving(true);
    try {
      const { listing } = await createListing(toListingBody(values));
      navigate("/dashboard/listings", { state: { created: listing.title } });
    } catch (err) {
      if (err.code === "DUPLICATE_LISTING") setDuplicate(err.details ?? {});
      else if (err.code === "VALIDATION_ERROR" && err.details)
        setErrors(serverFieldErrors(err.details));
      else if (err.code === "ACCOUNT_NOT_APPROVED")
        setFormError(
          "Your account is not approved yet, so you can't post listings.",
        );
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
    <form noValidate onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div className="space-y-1">
        <Link
          to="/dashboard/listings"
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          ← My listings
        </Link>
        <h1 className="text-3xl font-semibold">New listing</h1>
        <p className="text-text-muted">
          Tenants see these details. The area, building and unit number are
          checked so the same unit can't be listed twice.
        </p>
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
          <Field
            label="Area"
            error={
              errors.area ||
              (areas.error && "Could not load the areas. Reload the page.")
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
          <Field label="Building or estate" error={errors.building_name}>
            {input("building_name", { placeholder: "Jabavu Court" })}
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
              already posted this area, building and unit. Check the unit
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
          disabled={saving}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-text-on-primary hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? "Publishing…" : "Publish listing"}
        </button>
        <Link
          to="/dashboard/listings"
          className="rounded-lg border border-border bg-surface px-6 py-3 font-medium text-text hover:bg-bg"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default function NewListing() {
  return (
    <PosterGate needsApproval>
      <NewListingForm />
    </PosterGate>
  );
}
