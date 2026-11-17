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

export const getReceivedInquiries = (params) =>
  USE_MOCKS
    ? mock.getReceivedInquiries(params)
    : api("/inquiries/received", { params, auth: true });
