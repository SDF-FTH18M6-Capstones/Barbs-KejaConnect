export const PROPERTY_TYPES = [
  { value: "bedsitter", label: "Bedsitter" },
  { value: "studio", label: "Studio" },
  { value: "one_bedroom", label: "1 bedroom" },
  { value: "two_bedroom", label: "2 bedroom" },
  { value: "three_bedroom", label: "3 bedroom" },
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