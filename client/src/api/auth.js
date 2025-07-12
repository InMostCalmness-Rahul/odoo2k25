// src/api/auth.js

import axios from "./axios";

/**
 * 🔐 Login with email & password
 * @param {{ email: string, password: string }} credentials
 */
export const loginAPI = async ({ email, password }) => {
  const { data } = await axios.post("/auth/login", { email, password });
  return data;
};

/**
 * 📝 Signup a new user
 * @param {Object} userData
 */
export const signupAPI = async (userData) => {
  const { data } = await axios.post("/auth/signup", userData);
  return data;
};

/**
 * 🚪 Logout the current user
 */
export const logoutAPI = async () => {
  const { data } = await axios.post("/auth/logout");
  return data;
};

/**
 * 👤 Get current authenticated user
 */
export const getMeAPI = async () => {
  const { data } = await axios.get("/users/me");
  return data.user; // Extract the user object from the response
};
