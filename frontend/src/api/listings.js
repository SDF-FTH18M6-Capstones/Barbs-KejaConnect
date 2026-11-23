import { api } from "./client";
import * as mock from "./mockApi";
import { USE_MOCKS } from "./config";

const page = (res) => res.listings ?? res;

export const getListings = (params) =>
  USE_MOCKS ? mock.getListings(params) : api("/listings", { params });

export const getListing = (id) =>
  USE_MOCKS ? mock.getListing(id) : api(`/listings/${id}`);

export const getAreas = (params) =>
  USE_MOCKS ? mock.getAreas(params) : Promise.resolve({ items: [] });

export const getMyListings = (params) =>
  USE_MOCKS
    ? mock.getMyListings(params)
    : api("/listings/mine", { params, auth: true }).then(page);

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

export function uploadListingImages(id, files) {
  const form = new FormData();
  files.forEach((file) => form.append("files", file));
  return USE_MOCKS
    ? mock.uploadListingImages(id, form)
    : api(`/listings/${id}/images`, { method: "POST", body: form, auth: true });
}

export const deleteListingImage = (id, imageId) =>
  USE_MOCKS
    ? mock.deleteListingImage(id, imageId)
    : api(`/listings/${id}/images/${imageId}`, {
        method: "DELETE",
        auth: true,
      });

export const listingImages = (listing) =>
  (listing?.property_images ?? listing?.images ?? [])
    .filter((img) => img.url)
    .sort(
      (a, b) =>
        Number(b.is_cover) - Number(a.is_cover) || a.position - b.position,
    );

export const isMine = (listing, user) =>
  Boolean(user) &&
  (listing?.poster_id ?? listing?.poster?.id ?? listing?.user?.id) === user.id;
