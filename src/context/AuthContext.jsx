import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("sm_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sm_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .getMe()
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem("sm_user", JSON.stringify(user));
      })
      .catch(() => {
        localStorage.removeItem("sm_token");
        localStorage.removeItem("sm_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user } = await authApi.login(credentials);
    localStorage.setItem("sm_token", token);
    localStorage.setItem("sm_user", JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (data) => {
    const { token, user } = await authApi.register(data);
    localStorage.setItem("sm_token", token);
    localStorage.setItem("sm_user", JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sm_token");
    localStorage.removeItem("sm_user");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "ADMIN" || user?.role === "STAFF";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
