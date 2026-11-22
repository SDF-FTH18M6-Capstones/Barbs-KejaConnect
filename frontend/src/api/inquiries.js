import { api } from "./client";
import * as mock from "./mockApi";
import { USE_MOCKS } from "./config";

export const createInquiry = (listingId, message) =>
  USE_MOCKS
    ? mock.createInquiry(listingId, { message })
    : api(`/listings/${listingId}/inquiries`, {
        method: "POST",
        body: { message },
        auth: true,
      });

const toReceived = (q) => ({
  ...q,
  tenant: q.tenant ?? q.user ?? null,
  property: q.property ?? { id: q.property_id, title: "Your listing" },
});

export async function getReceivedInquiries({ listing_id, ...params } = {}) {
  if (USE_MOCKS) return mock.getReceivedInquiries({ listing_id, ...params });
  const res = await api("/inquiries/received", {
    params: { listing_id, ...params },
    auth: true,
  });
  const items = (res.items ?? []).map(toReceived);
  if (!listing_id) return { ...res, items };
  const id = Number(listing_id);
  const mine = items.filter((q) => (q.property_id ?? q.property.id) === id);
  return { ...res, items: mine, total: mine.length, pages: 1 };
}

const toSent = (q) => {
  const p = q.property ?? { id: q.property_id, title: "Listing removed" };
  const images = p.property_images ?? [];
  return {
    ...q,
    property: {
      ...p,
      poster_name: p.poster_name ?? p.user?.full_name,
      cover_image_url:
        p.cover_image_url ??
        images.find((img) => img.is_cover)?.url ??
        images[0]?.url ??
        null,
    },
  };
};

export async function getSentInquiries({ page = 1, per_page = 10 } = {}) {
  if (USE_MOCKS) return mock.getSentInquiries({ page, per_page });
  const res = await api("/inquiries/sent", {
    params: { page, per_page },
    auth: true,
  });
  if (res.items) return { ...res, items: res.items.map(toSent) };

  const all = (res.inquiries ?? [])
    .map(toSent)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return {
    items: all.slice((page - 1) * per_page, page * per_page),
    page,
    per_page,
    total: all.length,
    pages: Math.max(1, Math.ceil(all.length / per_page)),
  };
}
