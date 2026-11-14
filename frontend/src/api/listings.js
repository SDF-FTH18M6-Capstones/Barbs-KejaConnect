import { api } from "./client";
import * as mock from "./mockApi";
import { USE_MOCKS } from "./config";

export const getListings = (params) =>
  USE_MOCKS ? mock.getListings(params) : api("/listings", { params });

export const getListing = (id) => (USE_MOCKS ? mock.getListing(id) : api(`/listings/${id}`));

export const getAreas = () => (USE_MOCKS ? mock.getAreas() : api("/areas"));