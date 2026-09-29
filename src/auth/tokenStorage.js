// Single place that knows where the token is stored.
// sessionStorage = cleared when the browser tab is closed.
export const STORAGE_KEY = "studenthub.auth";

export function getAccessToken() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (saved?.accessToken && new Date(saved.expiresAtUtc) > new Date()) return saved.accessToken;
  } catch {
    // ignore corrupt storage
  }
  return null;
}
