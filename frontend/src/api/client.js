const BASE = "/api/v1";

export const TOKEN_KEY = "token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function api(
  path,
  { method = "GET", params = {}, body, auth = false } = {},
) {
  const clean = Object.entries(params).filter(([, v]) => v !== "" && v != null);
  const qs = new URLSearchParams(clean).toString();

  // FormData (file uploads) is sent as multipart; the browser sets its Content-Type
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const headers = {};
  if (body !== undefined && !isForm)
    headers["Content-Type"] = "application/json";
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}${qs ? `?${qs}` : ""}`, {
      method,
      headers,
      body:
        body === undefined ? undefined : isForm ? body : JSON.stringify(body),
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
    throw new ApiError(
      res.status,
      data.code ?? "SERVER_ERROR",
      data.error ?? "Request failed",
      data.details,
    );
  }
  return data;
}
