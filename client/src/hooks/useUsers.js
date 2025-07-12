// client/src/hooks/useUsers.js
import { useState, useEffect } from 'react';
import { searchUsers } from '../api/user';
import { toast } from 'react-toastify';

export const useUsers = (searchParams = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchUsers({ ...searchParams, ...params });
      
      setUsers(response.users || []);
      setTotalPages(response.totalPages || 0);
      setTotalUsers(response.totalUsers || 0);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.response?.data?.error || 'Failed to fetch users');
      toast.error(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(searchParams)]);

  return {
    users,
    loading,
    error,
    totalPages,
    totalUsers,
    refetch: fetchUsers
  };
};

export default useUsers;
