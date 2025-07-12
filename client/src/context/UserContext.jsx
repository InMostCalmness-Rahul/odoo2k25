import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, updateProfile, searchUsers } from "../api/user";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      setIsUserLoading(true);
      const data = await getProfileAPI();
      setProfile(data);
    } catch (err) {
      console.error(err);
      setUserError(err);
      toast.error("Failed to load profile");
    } finally {
      setIsUserLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    try {
      setIsUserLoading(true);
      const updated = await updateProfileAPI(formData);
      setProfile(updated);
      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setIsUserLoading(false);
    }
  };

  const searchUsers = async (query) => {
    try {
      const data = await searchUsersAPI(query);
      return data;
    } catch (err) {
      toast.error("Search failed");
      return [];
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUserProfile();
  }, [isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        profile,
        isUserLoading,
        userError,
        updateProfile,
        fetchUserProfile,
        searchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};
