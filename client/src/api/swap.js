// client/src/api/swap.js
import axios from "./axios";

// Create new swap request
export const createSwap = async (payload) => {
  const res = await axios.post("/swap", payload);
  return res.data;
};

// Get all swap requests (incoming + outgoing)
export const getSwaps = async () => {
  const res = await axios.get("/swap");
  return res.data;
};

// Accept or reject a swap
export const updateSwapStatus = async (id, payload) => {
  const res = await axios.patch(`/swap/${id}`, payload);
  return res.data;
};

// Delete a swap request
export const deleteSwap = async (id) => {
  const res = await axios.delete(`/swap/${id}`);
  return res.data;
};
