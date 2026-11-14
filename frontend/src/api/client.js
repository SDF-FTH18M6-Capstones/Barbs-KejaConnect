const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export const TOKEN_KEY = "access_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function api(path, { method = "GET", params = {}, body, auth = false } = {}) {
  const clean = Object.entries(params).filter(([, v]) => v !== "" && v != null);
  const qs = new URLSearchParams(clean).toString();

  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}${qs ? `?${qs}` : ""}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Network error");
  }

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && auth) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.assign("/login");
  }
  if (!res.ok) {
    throw new ApiError(res.status, data.code ?? "SERVER_ERROR", data.error ?? "Request failed", data.details);
  }
  return data;
}