// client/src/hooks/useSwapRequests.js
import { useState, useEffect } from 'react';
import { getSwaps, updateSwapStatus, deleteSwap } from '../api/swap';
import { toast } from 'react-toastify';

export const useSwapRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSwaps();
      setRequests(response.requests || []);
    } catch (err) {
      console.error('Failed to fetch swap requests:', err);
      setError(err.response?.data?.error || 'Failed to fetch swap requests');
      toast.error(err.response?.data?.error || 'Failed to fetch swap requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (requestId, status, additionalData = {}) => {
    try {
      await updateSwapStatus(requestId, { status, ...additionalData });
      toast.success(`Request ${status} successfully`);
      await fetchRequests(); // Refresh the list
    } catch (err) {
      console.error('Failed to update request:', err);
      toast.error(err.response?.data?.error || 'Failed to update request');
    }
  };

  const deleteRequest = async (requestId) => {
    try {
      await deleteSwap(requestId);
      toast.success('Request deleted successfully');
      await fetchRequests(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete request:', err);
      toast.error(err.response?.data?.error || 'Failed to delete request');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    updateRequest,
    deleteRequest
  };
};

export default useSwapRequests;
