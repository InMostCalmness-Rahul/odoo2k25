import { createContext, useContext, useEffect, useState } from "react";
import { loginAPI, signupAPI, logoutAPI, getMeAPI } from "../api/auth";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Load user from backend
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
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await loginAPI({ email, password });
      
      // Extract access token and user from response
      if (response.accessToken) {
        setAccessToken(response.accessToken);
        // Store token in localStorage for persistence across sessions
        localStorage.setItem('accessToken', response.accessToken);
      }
      
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
      const response = await signupAPI(userData);
      
      // Extract access token and user from response
      if (response.accessToken) {
        setAccessToken(response.accessToken);
        // Store token in localStorage for persistence across sessions
        localStorage.setItem('accessToken', response.accessToken);
      }
      
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
      setAccessToken(null);
      // Clear token from localStorage
      localStorage.removeItem('accessToken');
      toast.success("Logged out");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const refreshAuth = loadUser; // For other contexts/hooks to call if needed

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        accessToken,
        login,
        signup,
        logout,
        refreshAuth, // optional: exposed for reuse
        updateUserProfile,
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
