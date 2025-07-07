"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  isVerified: boolean;
  feedbackCount: number;
  widgetCount: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Prefer an env-var so the backend URL can be configured at runtime
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("token");
    console.log("Checking for existing token:", token ? "found" : "not found");

    if (token && token !== "undefined" && token !== "null") {
      fetchUser(token);
    } else {
      // Clear any invalid tokens
      localStorage.removeItem("token");
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string, retryCount = 0) => {
    const maxRetries = 3;

    try {
      console.log(`Fetching user with token... (attempt ${retryCount + 1})`);
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Fetch user response status:", res.status);

      // If token is invalid, clear it
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          console.log("Token expired or invalid, clearing session");
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
          return;
        }
        // For other errors, throw to trigger catch block
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log("User data fetched successfully:", responseData);

      if (responseData.user) {
        setUser(responseData.user);
        console.log("User set in state");
      } else {
        console.warn("No user data in response");
        localStorage.removeItem("token");
        setUser(null);
      }

      // Set loading to false after successful fetch
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user:", err);

      // Check if it's a network error and we can retry
      if (
        err instanceof TypeError &&
        err.message.includes("fetch") &&
        retryCount < maxRetries
      ) {
        console.log(`Network error - retrying in ${(retryCount + 1) * 1000}ms`);
        setTimeout(() => {
          fetchUser(token, retryCount + 1);
        }, (retryCount + 1) * 1000);
        return;
      }

      // If we've exhausted retries or it's not a network error, clear token
      console.log("Max retries reached or non-network error - clearing token");
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    console.log("Login response:", data);

    // Ensure token is valid before storing
    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      console.log("Login successful, token stored");
    } else {
      throw new Error("Invalid login response");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }
  };

  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
