// client/src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { getProfile, updateProfile, uploadProfilePhoto } from '../api/user';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const { user, refreshAuth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProfile();
      setProfile(response.user || response);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError(err.response?.data?.error || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      setUpdating(true);
      const response = await updateProfile(profileData);
      setProfile(response.user || response);
      toast.success('Profile updated successfully');
      await refreshAuth(); // Refresh auth context
      return response;
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorMsg = err.response?.data?.error || 'Failed to update profile';
      toast.error(errorMsg);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const uploadPhoto = async (file) => {
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append('profilePhoto', file);
      
      const response = await uploadProfilePhoto(formData);
      setProfile(response.user || response);
      toast.success('Profile photo updated successfully');
      await refreshAuth(); // Refresh auth context
      return response;
    } catch (err) {
      console.error('Failed to upload photo:', err);
      const errorMsg = err.response?.data?.error || 'Failed to upload photo';
      toast.error(errorMsg);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (user) {
      setProfile(user);
    } else {
      fetchProfile();
    }
  }, [user]);

  return {
    profile,
    loading,
    updating,
    error,
    updateUserProfile,
    uploadPhoto,
    refetch: fetchProfile
  };
};

export default useProfile;
