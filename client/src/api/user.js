// client/src/api/user.js
import axios from "./axios";

// Get logged-in user profile
export const getProfile = async () => {
  const res = await axios.get("/user/me");
  return res.data;
};

// Update user profile
export const updateProfile = async (data) => {
  const res = await axios.put("/user/update", data);
  return res.data;
};

// Search users by skill or availability
export const searchUsers = async (params = {}) => {
  const res = await axios.get("/users", { params });
  return res.data;
};
