const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function api(path, { params = {} } = {}) {
  const clean = Object.entries(params).filter(([, v]) => v !== "" && v != null);
  const qs = new URLSearchParams(clean).toString();

  let res;
  try {
    res = await fetch(`${BASE}${path}${qs ? `?${qs}` : ""}`);
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Network error");
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, body.code ?? "SERVER_ERROR", body.error ?? "Request failed", body.details);
  }
  return body;
}