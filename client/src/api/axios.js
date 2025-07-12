import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for HttpOnly cookie
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging and token handling
axiosInstance.interceptors.request.use(
  (config) => {
    // Add access token to Authorization header if available
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and data extraction
axiosInstance.interceptors.response.use(
  (response) => {
    // Extract data from backend response structure
    // Backend returns: { success: true, data: {...}, message: "..." }
    if (response.data?.success === false) {
      throw new Error(response.data.error || "API request failed");
    }
    
    // Return the response as-is, let individual API functions handle data extraction
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response?.status === 401) {
      // Handle unauthorized - don't show toast for silent auth checks
      console.log("[API] Unauthorized access");
    } else if (error.response?.status === 403) {
      toast.error("Access forbidden");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.response?.data?.error) {
      // Don't show toast here - let components handle it
      console.error("[API] Error:", error.response.data.error);
    } else if (error.code === 'ECONNABORTED') {
      toast.error("Request timeout. Please check your connection.");
    } else if (!error.response) {
      toast.error("Network error. Please check your connection.");
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
