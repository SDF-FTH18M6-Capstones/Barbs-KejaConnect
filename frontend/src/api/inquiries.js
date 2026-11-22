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

export const getSentInquiries = (params) =>
  USE_MOCKS
    ? mock.getSentInquiries(params)
    : api("/inquiries/sent", { params, auth: true });
