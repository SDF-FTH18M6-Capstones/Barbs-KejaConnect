import { mockListings, mockAreas } from "../data/mockListings";
import { ApiError } from "./client";
import { mockMyListings, unitFor } from "../data/mockPoster";
import { getCurrentUser } from "../components/inquiries/data/currentUser";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export async function getListings({
  page = 1,
  per_page = 10,
  area,
  property_type,
  min_price,
  max_price,
} = {}) {
  await delay();
  const min = min_price === "" || min_price == null ? null : Number(min_price);
  const max = max_price === "" || max_price == null ? null : Number(max_price);
  if (min != null && max != null && min > max) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      "min_price must not exceed max_price",
      { min_price: ["Too high"] },
    );
  }

  const pp = Math.min(Number(per_page) || 10, 50);
  const matches = mockListings
    .filter((l) => l.status === "available")
    .filter((l) => !area || l.area === area)
    .filter((l) => !property_type || l.property_type === property_type)
    .filter(
      (l) =>
        (min == null || l.price_monthly >= min) &&
        (max == null || l.price_monthly <= max),
    )
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

function toDetail(l) {
  return {
    ...l,
    description: `${l.title} in ${l.area}. Spacious and well maintained, close to shops and public transport. Water and security are included in the rent.`,
    county: "Nairobi",
    unit_number: `B${l.id}`,
    lr_number: null,
    images: Array.from({ length: 6 }, (_, i) => ({
      id: l.id * 100 + i,
      url: null,
      is_cover: i === 0,
      position: i,
    })),
    poster: { ...l.poster, role: l.id % 2 ? "manager" : "owner" },
    updated_at: l.created_at,
  };
}

export async function getListing(id) {
  await delay();
  const l = mockListings.find(
    (x) => x.id === Number(id) && x.status !== "removed",
  );
  if (!l) throw new ApiError(404, "NOT_FOUND", "Listing not found");
  return { listing: toDetail(l) };
}

export async function createInquiry(listingId, { message }) {
  await delay(400);
  const l = mockListings.find(
    (x) => x.id === Number(listingId) && x.status !== "removed",
  );
  if (!l) throw new ApiError(404, "NOT_FOUND", "Listing not found");
  if (l.status !== "available")
    throw new ApiError(403, "FORBIDDEN", "Listing is not available");
  const len = (message ?? "").trim().length;
  if (len < 10 || len > 1000) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid message", {
      message: ["Must be 10 to 1000 characters"],
    });
  }
  return {
    inquiry: {
      id: Date.now(),
      message: message.trim(),
      status: "new",
      created_at: new Date().toISOString(),
      property: { id: l.id, title: l.title },
    },
  };
}

// ---------- Poster dashboard ----------

const posterId = () => getCurrentUser()?.id ?? 11;

const paginate = (all, page = 1, per_page = 10) => {
  const p = Number(page) || 1;
  const pp = Number(per_page) || 10;
  return {
    items: all.slice((p - 1) * pp, p * pp),
    page: p,
    per_page: pp,
    total: all.length,
    pages: Math.max(1, Math.ceil(all.length / pp)),
  };
};

export async function getMyListings({ status, page = 1, per_page = 10 } = {}) {
  await delay();
  const mine = mockMyListings
    .filter((l) => l.poster.id === posterId() && l.status !== "removed")
    .filter((l) => !status || l.status === status)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return paginate(mine, page, per_page);
}

export async function setListingStatus(id, status) {
  await delay(300);
  const l = mockMyListings.find((x) => x.id === Number(id));
  if (!l) throw new ApiError(404, "NOT_FOUND", "Listing not found");
  if (l.poster.id !== posterId())
    throw new ApiError(403, "FORBIDDEN", "This is not your listing");
  l.status = status;
  return { listing: { ...l } };
}

const dedupeKey = (area, building, unit) =>
  [area, building, unit]
    .map((s) =>
      String(s ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_"),
    )
    .join("|");

export async function createListing(body) {
  await delay(500);
  const user = getCurrentUser();
  if (user && user.approval_status !== "approved") {
    throw new ApiError(
      403,
      "ACCOUNT_NOT_APPROVED",
      "Your account has not been approved yet",
    );
  }
  if (!mockAreas.includes(body.area)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid listing", {
      area: ["Choose an area from the list"],
    });
  }
  const key = dedupeKey(body.area, body.building_name, body.unit_number);
  const existing = mockMyListings.find(
    (l) =>
      l.status !== "removed" &&
      dedupeKey(l.area, l.building_name, unitFor(l)) === key,
  );
  if (existing) {
    throw new ApiError(
      409,
      "DUPLICATE_LISTING",
      "This unit is already listed",
      {
        existing_listing_id: existing.id,
        poster_name: existing.poster.full_name,
      },
    );
  }
  const listing = {
    ...body,
    id: Math.max(...mockMyListings.map((l) => l.id)) + 1,
    county: "Nairobi",
    status: "available",
    cover_image_url: null,
    poster: {
      id: user?.id ?? 11,
      full_name: user?.full_name ?? "Wanjiku Mwangi",
      is_verified: true,
    },
    created_at: new Date().toISOString(),
  };
  mockMyListings.push(listing);
  return { listing };
}
