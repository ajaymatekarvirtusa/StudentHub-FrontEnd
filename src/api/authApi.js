import { request } from "./httpClient.js";

/** POST /api/Auth/token -> { accessToken, tokenType, expiresIn, expiresAtUtc, username, role } */
export function login(username, password) {
  return request("/Auth/token", {
    method: "POST",
    body: { username, password },
    auth: false,
  });
}
