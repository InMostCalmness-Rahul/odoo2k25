import { createContext, useContext, useEffect, useState } from "react";
import { loginAPI, signupAPI, logoutAPI, getMeAPI } from "../api/auth";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load user from backend
  const loadUser = async () => {
    try {
      setIsLoading(true);
      const user = await getMeAPI();
      setUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      // Handle 401 errors silently (user not authenticated)
      // Since we're using HttpOnly cookies, 401 just means not authenticated
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      await loginAPI({ email, password });
      toast.success("Login successful!");
      await loadUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      await signupAPI(userData);
      toast.success("Signup successful!");
      await loadUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const refreshAuth = loadUser; // For other contexts/hooks to call if needed

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        logout,
        refreshAuth, // optional: exposed for reuse
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
