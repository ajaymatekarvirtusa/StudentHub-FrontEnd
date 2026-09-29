// Small fetch wrapper shared by all API modules.
// - Adds the JSON headers and the Bearer token
// - Turns API errors into an ApiError with a readable message and field errors

import { getAccessToken } from "../auth/tokenStorage.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

let onUnauthorized = () => {};

/** AuthProvider registers what to do when the API returns 401 (log out). */
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export class ApiError extends Error {
  constructor(message, status, fieldErrors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors; // e.g. { name: "Name is required." }
  }
}

// "MobileNo" -> "mobileNo" so it matches the form field names
const toCamel = (key) => key.charAt(0).toLowerCase() + key.slice(1);

async function parseError(response) {
  let body = null;
  try {
    body = await response.json();
  } catch {
    // no JSON body
  }

  // ASP.NET / FluentValidation: { title, errors: { Name: ["..."] } }
  if (body?.errors && typeof body.errors === "object") {
    const fieldErrors = {};
    for (const [key, messages] of Object.entries(body.errors)) {
      fieldErrors[toCamel(key)] = Array.isArray(messages) ? messages[0] : String(messages);
    }
    return new ApiError(body.title || "Please fix the highlighted fields.", response.status, fieldErrors);
  }

  // StudentHub ErrorResponse: { error: "..." }
  if (body?.error) return new ApiError(body.error, response.status);
  if (body?.message) return new ApiError(body.message, response.status);

  const defaults = {
    401: "Your session has expired. Please sign in again.",
    403: "You do not have permission to do this.",
    404: "Not found.",
    429: "Too many requests. Please wait and try again.",
  };
  return new ApiError(defaults[response.status] || `Request failed (${response.status}).`, response.status);
}

export async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = auth ? getAccessToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the StudentHub API running?", 0);
  }

  if (!response.ok) {
    const error = await parseError(response);
    if (response.status === 401 && auth) onUnauthorized();
    throw error;
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
