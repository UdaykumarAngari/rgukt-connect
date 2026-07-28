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
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfilePhoto = async () => {
    if (!session?.token) return;
    try {
      setLoading(true);
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setProfilePhoto(res.data.profilePhoto);
    } catch (err) {
      console.error('Failed to load profile photo globally:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.token) {
      fetchProfilePhoto();
    } else {
      setProfilePhoto(null);
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ profilePhoto, setProfilePhoto, fetchProfilePhoto, loading }}>
      {children}
    </UserContext.Provider>
  );
};
