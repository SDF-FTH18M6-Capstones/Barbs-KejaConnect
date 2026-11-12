import { mockListings, mockAreas } from "../data/mockListings";
import { ApiError } from "./client";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export async function getListings({ page = 1, per_page = 10, area, property_type, min_price, max_price } = {}) {
  await delay();
  const min = min_price === "" || min_price == null ? null : Number(min_price);
  const max = max_price === "" || max_price == null ? null : Number(max_price);
  if (min != null && max != null && min > max) {
    throw new ApiError(400, "VALIDATION_ERROR", "min_price must not exceed max_price", { min_price: ["Too high"] });
  }

  const pp = Math.min(Number(per_page) || 10, 50);
  const matches = mockListings
    .filter((l) => l.status === "available")
    .filter((l) => !area || l.area === area)
    .filter((l) => !property_type || l.property_type === property_type)
    .filter((l) => (min == null || l.price_monthly >= min) && (max == null || l.price_monthly <= max))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const p = Number(page) || 1;
  return {
    items: matches.slice((p - 1) * pp, p * pp), 
    page: p,
    per_page: pp,
    total: matches.length,
    pages: Math.ceil(matches.length / pp),
  };
}

export async function getAreas() {
  await delay(100);
  return { items: mockAreas };
}