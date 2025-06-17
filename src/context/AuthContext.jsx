import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const TOKEN_KEY = "user_token";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserTokenState] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUserToken = useCallback((token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setUserTokenState(token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setUserTokenState(null);
      setUserInfo(null);
    }
  }, []);

  const logout = useCallback(() => setUserToken(null), [setUserToken]);

  const checkToken = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      setUserInfo(null);
      setUserTokenState(null);
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.sub || decoded.userId || decoded.id;
    } catch {
      setUserToken(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/600/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setUserToken(null);
        setUserInfo(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setUserInfo(data);
      setUserTokenState(token);
      toast.info(`${data.fName} ${data.lName} عزیز خوش امدی`);
    } catch {
      setUserToken(null);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, [setUserToken]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  useEffect(() => {
    if (userToken) {
      checkToken();
    }
  }, [userToken, checkToken]);

  const isLoggedIn = !!userToken;

  return <AuthContext.Provider value={{ userToken, userInfo, setUserInfo, setUserToken, isLoggedIn, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
