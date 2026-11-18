import { api } from "./client";
import * as mock from "./mockApi";
import { USE_MOCKS } from "./config";

export const getListings = (params) =>
  USE_MOCKS ? mock.getListings(params) : api("/listings", { params });

//todo: The getListing function does not exist in the file ./mockApi, create this function to fix issue. mock.getListing(id)

export const getListing = (id) =>
  USE_MOCKS ? mock.getListing(id) : api(`/listings/${id}`);

export const getAreas = () => (USE_MOCKS ? mock.getAreas() : api("/areas"));

// ---------- Poster dashboard ----------

export const getMyListings = (params) =>
  USE_MOCKS
    ? mock.getMyListings(params)
    : api("/listings/mine", { params, auth: true });

export const setListingStatus = (id, status) =>
  USE_MOCKS
    ? mock.setListingStatus(id, status)
    : api(`/listings/${id}/status`, {
        method: "PATCH",
        body: { status },
        auth: true,
      });

export const createListing = (body) =>
  USE_MOCKS
    ? mock.createListing(body)
    : api("/listings", { method: "POST", body, auth: true });

export const updateListing = (id, body) =>
  USE_MOCKS
    ? mock.updateListing(id, body)
    : api(`/listings/${id}`, { method: "PUT", body, auth: true });
