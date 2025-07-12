// client/src/api/admin.js
import axios from "./axios";

// Get user activity or feedback reports (CSV, logs, etc.)
export const getReports = async () => {
  const res = await axios.get("/admin/reports");
  return res.data;
};

// Ban a user by ID
export const banUser = async (userId) => {
  const res = await axios.patch(`/admin/user/${userId}/ban`);
  return res.data;
};

// View all swap activity (admin view)
export const getAllSwaps = async () => {
  const res = await axios.get("/admin/swaps");
  return res.data;
};
