// Backend calls for the poster dashboard.
// Relative URLs go through the Vite proxy. If the API contract uses different
// paths or field names, change them here only.
import {
  SAMPLE_SUMMARY,
  SAMPLE_MY_LISTINGS,
  SAMPLE_RECEIVED,
} from "./samplePoster";

const USE_SAMPLE = import.meta.env.VITE_USE_SAMPLE_DATA === "true";

function authHeaders(extra = {}) {
  const token = localStorage.getItem("access_token");
  return { ...extra, ...(token && { Authorization: `Bearer ${token}` }) };
}

async function getJson(url, fallback) {
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    // Errors follow the agreed shape { error, code, details }
    throw new Error(data.error || fallback);
  }
  return res.json();
}

const list = (items) => ({
  items,
  page: 1,
  per_page: items.length,
  total: items.length,
  pages: 1,
});

export async function getPosterDashboard() {
  if (USE_SAMPLE) {
    return {
      summary: SAMPLE_SUMMARY,
      listings: list(SAMPLE_MY_LISTINGS),
      inquiries: list(SAMPLE_RECEIVED),
    };
  }
  const error = "Could not load your dashboard. Try again.";
  const [summary, listings, inquiries] = await Promise.all([
    getJson("/api/v1/properties/mine/summary", error),
    getJson("/api/v1/properties/mine?page=1&per_page=6", error),
    getJson("/api/v1/inquiries/received?page=1&per_page=3", error),
  ]);
  return { summary, listings, inquiries };
}

export async function setListingStatus(id, status) {
  if (USE_SAMPLE) return { id, status };

  const res = await fetch(`/api/v1/properties/${id}`, {
    method: "PATCH",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Could not update the listing. Try again.");
  }
  return res.json();
}
