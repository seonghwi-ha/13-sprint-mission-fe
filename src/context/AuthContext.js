"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/userApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "accessToken";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await getMe(token);
      setUser(data);
      setLoading(false);
    }
    loadUser();
  }, []);

  function login(token, userData) {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  const isLoggedIn = Boolean(user);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, loading, login, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider 안에서 사용해야 합니다.");
  return ctx;
}
