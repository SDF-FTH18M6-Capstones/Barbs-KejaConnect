import { api } from "./client";
import * as mock from "./mockApi";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export const getListings = (params) =>
  USE_MOCKS ? mock.getListings(params) : api("/listings", { params });

export const getAreas = () => (USE_MOCKS ? mock.getAreas() : api("/areas"));