import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext.js";
import { login as loginRequest } from "../api/authApi.js";
import { setUnauthorizedHandler } from "../api/httpClient.js";
import { STORAGE_KEY } from "./tokenStorage.js";

// sessionStorage: the token is cleared when the browser tab is closed.
function loadSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (saved?.accessToken && new Date(saved.expiresAtUtc) > new Date()) return saved;
  } catch {
    // ignore corrupt storage
  }
  return null;
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);
  const [sessionMessage, setSessionMessage] = useState("");

  const logout = useCallback((message = "") => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setSessionMessage(message);
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await loginRequest(username, password);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    setSessionMessage("");
    setSession(result);
  }, []);

  // Log out when any API call returns 401.
  useEffect(() => {
    setUnauthorizedHandler(() => logout("Your session has expired. Please sign in again."));
  }, [logout]);

  // Log out automatically when the token expires.
  useEffect(() => {
    if (!session) return undefined;
    const msLeft = new Date(session.expiresAtUtc) - new Date();
    const timer = setTimeout(
      () => logout("Your session has expired. Please sign in again."),
      Math.max(msLeft, 0),
    );
    return () => clearTimeout(timer);
  }, [session, logout]);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session),
      user: session ? { username: session.username, role: session.role } : null,
      expiresAtUtc: session?.expiresAtUtc,
      sessionMessage,
      login,
      logout,
    }),
    [session, sessionMessage, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
