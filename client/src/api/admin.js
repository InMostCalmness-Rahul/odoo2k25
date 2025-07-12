// client/src/api/admin.js
import axios from "./axios";

// Get all users for admin panel
export const getAllUsers = async (params = {}) => {
  const res = await axios.get("/admin/users", { params });
  return res.data;
};

// Get admin statistics
export const getAdminStats = async () => {
  const res = await axios.get("/admin/stats");
  return res.data;
};

// Get user activity or feedback reports (CSV, logs, etc.)
export const getReports = async () => {
  const res = await axios.get("/admin/reports");
  return res.data;
};

// Ban/unban a user by ID
export const banUser = async (userId, isBanned = true) => {
  const res = await axios.patch(`/admin/user/${userId}/ban`, { isBanned });
  return res.data;
};

// Delete a user by ID
export const deleteUser = async (userId) => {
  const res = await axios.delete(`/admin/user/${userId}`);
  return res.data;
};

// View all swap activity (admin view)
export const getAllSwaps = async (params = {}) => {
  const res = await axios.get("/admin/swaps", { params });
  return res.data;
};
