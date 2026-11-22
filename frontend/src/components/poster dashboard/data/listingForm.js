export const COUNTIES = [
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita-Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans-Nzoia",
  "Uasin Gishu",
  "Elgeyo-Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
  "Nairobi",
];

export const EMPTY_LISTING = {
  title: "",
  property_type: "",
  price_monthly: "",
  bedrooms: "",
  bathrooms: "",
  county: "",
  area: "",
  building_name: "",
  street_address: "",
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
  const isHouse = v.property_type === "house";

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

  if (!v.county) errors.county = "Choose the county";
  if (!v.area.trim()) errors.area = "Enter the area, e.g. Kilimani";

  if (isHouse) {
    if (!v.street_address.trim()) {
      errors.street_address = "Enter the street address";
    }
  } else if (!v.building_name.trim()) {
    errors.building_name = "Enter the building or estate name";
  }

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

const withoutEmpty = (body) =>
  Object.fromEntries(Object.entries(body).filter(([, v]) => v !== null));

export function toListingBody(v) {
  const noBedroom = NO_BEDROOM_TYPES.includes(v.property_type);
  return withoutEmpty({
    title: v.title.trim(),
    description: v.description.trim(),
    property_type: v.property_type,
    price_monthly: Number(v.price_monthly),
    bedrooms: noBedroom ? 0 : numberOrNull(v.bedrooms),
    bathrooms: numberOrNull(v.bathrooms),
    county: v.county,
    area: v.area.trim(),
    building_name: v.building_name.trim() || null,
    street_address: v.street_address.trim() || null,
    unit_number: v.unit_number.trim(),
    lr_number: v.lr_number.trim() || null,
  });
}

export function serverFieldErrors(details = {}) {
  return Object.fromEntries(
    Object.entries(details).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : String(messages),
    ]),
  );
}

const asText = (v) => (v === null || v === undefined ? "" : String(v));

export function fromListing(listing) {
  return Object.fromEntries(
    Object.keys(EMPTY_LISTING).map((key) => [key, asText(listing[key])]),
  );
}

export const MAX_PHOTOS = 10;
export const MAX_PHOTO_MB = 5;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function checkPhoto(file) {
  if (!PHOTO_TYPES.includes(file.type)) {
    return `${file.name} is not a JPG, PNG or WEBP photo`;
  }
  if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
    return `${file.name} is larger than ${MAX_PHOTO_MB} MB`;
  }
  return "";
}
