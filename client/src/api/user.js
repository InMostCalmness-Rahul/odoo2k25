// client/src/api/user.js
import axios from "./axios";

// Get logged-in user profile
export const getProfile = async () => {
  const res = await axios.get("/users/me");
  return res.data.user; // Extract user from the response
};

// Update user profile
export const updateProfile = async (data) => {
  const res = await axios.put("/users/me", data);
  return res.data.user; // Extract user from the response
};

// Search users by skill or availability
export const searchUsers = async (params = {}) => {
  const res = await axios.get("/users", { params });
  return res.data; // This returns { users: [...], pagination: {...} }
};

// Get user by ID with feedback
export const getUserById = async (userId) => {
  const res = await axios.get(`/users/${userId}`);
  return res.data.user; // Extract user from the response
};

// Add feedback to a user
export const addFeedback = async (userId, feedbackData) => {
  const res = await axios.post(`/users/${userId}/feedback`, feedbackData);
  return res.data;
};

// Upload profile photo
export const uploadProfilePhoto = async (formData) => {
  const res = await axios.post("/users/upload-photo", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};
