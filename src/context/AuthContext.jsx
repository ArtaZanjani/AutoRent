import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "supabase_token";

const AuthContext = createContext(null);

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.sub;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUserToken = useCallback((token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setToken(token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUserInfo(null);
    }
  }, []);

  const logout = useCallback(() => setUserToken(null), [setUserToken]);

  const fetchUserInfo = useCallback(async () => {
    if (!token) {
      setUserInfo(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const userId = getUserIdFromToken(token);

    if (!userId) {
      setUserInfo(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}profiles?id=eq.${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_API_KEY,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        setUserToken(null);
        setUserInfo(null);
      } else {
        const data = await res.json();

        const dataInfo = data[0];

        setUserInfo({ id: userId, fName: dataInfo.fName, lName: dataInfo.lName, email: dataInfo.email, nationalId: dataInfo.nationalId });

        toast.info(`${dataInfo.fName} ${dataInfo.lName} عزیز خوش اومدی`);
      }
    } catch (err) {
      setUserToken(null);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, [token, setUserToken]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const isLoggedIn = !!token;

  return <AuthContext.Provider value={{ token, userInfo, setUserInfo, setUserToken, isLoggedIn, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
