import { SAMPLE_INQUIRIES } from "./sampleInquiries";

const USE_SAMPLE = import.meta.env.VITE_USE_SAMPLE === "true";
export const PER_PAGE = 10;

export async function getMyInquiries(page = 1) {
  if (USE_SAMPLE) {
    const start = (page - 1) * PER_PAGE;
    return {
      items: SAMPLE_INQUIRIES.slice(start, start + PER_PAGE),
      page,
      per_page: PER_PAGE,
      total: SAMPLE_INQUIRIES.length,
      pages: Math.max(1, Math.ceil(SAMPLE_INQUIRIES.length / PER_PAGE)),
    };
  }

  const token = localStorage.getItem("access_token");
  const res = await fetch(
    `/api/v1/inquiries/sent?page=${page}&per_page=${PER_PAGE}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      data.message || "Could not load your inquiries. Try again.",
    );
  }
  return res.json();
}
