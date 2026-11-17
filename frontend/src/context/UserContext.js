import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

const UserContext = createContext();

// User Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch(`/api/users/login`, {
        method: "POST",
        body: { email, password },
      });
      // backend returns { success, user: { ... } }
      const returnedUser = data.user || data;
      setUser(returnedUser);
      if (returnedUser.token) setToken(returnedUser.token);
      return returnedUser;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch(`/api/users/register`, {
        method: "POST",
        body: userData,
      });
      const returnedUser = data.user || data;
      setUser(returnedUser);
      if (returnedUser.token) setToken(returnedUser.token);
      return returnedUser;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = async (updates) => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/users/profile`, {
        method: "PUT",
        body: updates,
      });
      const returnedUser = data.user || data;
      setUser(returnedUser);
      if (returnedUser.token) setToken(returnedUser.token);
      return returnedUser;
    } catch (err) {
      setError(err.message || "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// User Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
