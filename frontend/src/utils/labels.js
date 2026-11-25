export const PROPERTY_TYPES = [
  { value: "single_room", label: "Single room" },
  { value: "bedsitter", label: "Bedsitter" },
  { value: "studio", label: "Studio" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "commercial", label: "Commercial" },
];

export function roomsLabel({ property_type, bedrooms, bathrooms }) {
  if (property_type === "commercial") return "Commercial";
  const ba = `${bathrooms} ba`;
  if (property_type === "bedsitter") return `Bedsitter · ${ba}`;
  if (property_type === "studio") return `Studio · ${ba}`;
  return `${bedrooms} bd · ${ba}`;
}
