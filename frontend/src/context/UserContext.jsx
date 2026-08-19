import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ session, children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    if (!session?.token) return;
    try {
      setLoading(true);
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setUserProfile(res.data);
      setProfilePhoto(res.data.profilePhoto);
    } catch (err) {
      console.error('Failed to load profile globally:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.token) {
      fetchProfile();
    } else {
      setUserProfile(null);
      setProfilePhoto(null);
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ userProfile, profilePhoto, setProfilePhoto, fetchProfilePhoto: fetchProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
};
