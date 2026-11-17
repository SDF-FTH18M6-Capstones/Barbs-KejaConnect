export const EMPTY_LISTING = {
  title: "",
  property_type: "",
  price_monthly: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  building_name: "",
  unit_number: "",
  lr_number: "",
  description: "",
};

export const DESCRIPTION_MAX = 250;

export const NO_BEDROOM_TYPES = ["bedsitter", "studio"];

const wholeNumber = (v) => /^\d+$/.test(String(v).trim());

export const validateListing = (v) => {
  const errors = {};
  const commercial = v.property_type === "commercial";

  if (v.title.trim().length < 5)
    errors.title = "Enter a title with at least 5 characters";
  if (!v.property_type) errors.property_type = "Select a property type";

  if (!wholeNumber(v.price_monthly) || Number(v.price_monthly) <= 0) {
    errors.price_monthly = "Enter the monthly rent e.g. 25000";
  }
  if (
    !commercial &&
    !NO_BEDROOM_TYPES.includes(v.property_type) &&
    !wholeNumber(v.bedrooms)
  ) {
    errors.bedrooms = "Enter the number of bedrooms";
  }
  if (!commercial && !wholeNumber(v.bathrooms)) {
    errors.bathrooms = "Enter the number of bathrooms";
  }

  if (!v.area) errors.area = "Choose the area";
  if (!v.building_name.trim())
    errors.building_name = "Enter the building or estate name";
  if (!v.unit_number.trim())
    errors.unit_number = "Enter the unit number, e.g. B4";

  const len = v.description.trim().length;
  if (len < 20)
    errors.description = "Describe the unit in at least 20 characters";
  else if (len > DESCRIPTION_MAX)
    errors.description = `Keep it under ${DESCRIPTION_MAX} characters`;

  return errors;
};

const numberOrNull = (v) => (String(v).trim() === "" ? null : Number(v));

export function toListingBody(v) {
  const noBedroom = NO_BEDROOM_TYPES.includes(v.property_type);
  return {
    title: v.title.trim(),
    description: v.description.trim(),
    property_type: v.property_type,
    price_monthly: Number(v.price_monthly),
    bedrooms: noBedroom ? 0 : numberOrNull(v.bedrooms),
    bathrooms: numberOrNull(v.bathrooms),
    area: v.area,
    building_name: v.building_name.trim(),
    unit_number: v.unit_number.trim(),
    lr_number: v.lr_number.trim() || null,
  };
}

export function serverFieldErrors(details = {}) {
  return Object.fromEntries(
    Object.entries(details).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : String(messages),
    ]),
  );
}
