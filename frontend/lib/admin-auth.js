"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api, setAuthToken } from "./api";

const AdminAuthContext = createContext(null);
const TOKEN_KEY = "lg_admin_token";

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      setAuthToken(token);
      api
        .get("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          Cookies.remove(TOKEN_KEY);
          setAuthToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    Cookies.set(TOKEN_KEY, data.token, { expires: 7 });
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    Cookies.remove(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth phải dùng trong AdminAuthProvider");
  return ctx;
}
