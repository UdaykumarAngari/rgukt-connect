import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NetworkContext = createContext(null);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

export const NetworkProvider = ({ session, onLogout, children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDirectory = async () => {
    if (!session?.token) return;
    try {
      const res = await axios.get('/api/users/directory', {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching alumni directory:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingInvites = async () => {
    if (!session?.token) return;
    try {
      const res = await axios.get('/api/connections/pending-received', {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setPendingInvites(res.data);
    } catch (err) {
      console.error('Error fetching pending invites:', err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        onLogout();
      }
    }
  };

  useEffect(() => {
    if (session?.token) {
      fetchPendingInvites();
      fetchDirectory();
    } else {
      setUsers([]);
      setPendingInvites([]);
      setLoading(true);
    }
  }, [session, refreshTrigger]);

  const handleAcceptInvite = async (requestId, showPrompt) => {
    if (!session?.token) return;
    try {
      await axios.put(`/api/connections/accept/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      fetchPendingInvites();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      if (showPrompt) {
        showPrompt({ type: 'error', message: 'Failed to accept request.' });
      }
    }
  };

  const handleRejectInvite = async (requestId, showPrompt) => {
    if (!session?.token) return;
    if (showPrompt) {
      showPrompt({
        type: 'confirm',
        title: 'Ignore Request',
        message: 'Are you sure you want to ignore this connection request?',
        confirmText: 'Ignore',
        onConfirm: async () => {
          try {
            await axios.delete(`/api/connections/reject/${requestId}`, {
              headers: { Authorization: `Bearer ${session.token}` }
            });
            fetchPendingInvites();
            setRefreshTrigger(prev => prev + 1);
          } catch (err) {
            console.error(err);
            showPrompt({ type: 'error', message: 'Failed to decline request.' });
          }
        }
      });
    }
  };

  const handleStatusChange = () => {
    fetchPendingInvites();
    setRefreshTrigger(prev => prev + 1);
  };

  const filteredUsers = users.filter(u => {
    const search = searchQuery.toLowerCase();
    
    const matchesBasic = 
      u.name?.toLowerCase().includes(search) || 
      u.universityEmail?.toLowerCase().includes(search) || 
      u.idNumber?.toLowerCase().includes(search) || 
      u.description?.toLowerCase().includes(search) ||
      u.role?.toLowerCase().includes(search) ||
      u.branch?.toLowerCase().includes(search);
      
    const matchesExperience = u.experiences?.some(exp => 
      exp.companyName?.toLowerCase().includes(search) ||
      exp.title?.toLowerCase().includes(search)
    ) || false;

    return matchesBasic || matchesExperience;
  });

  return (
    <NetworkContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        pendingInvites,
        refreshTrigger,
        setRefreshTrigger,
        users,
        loading,
        fetchDirectory,
        fetchPendingInvites,
        handleAcceptInvite,
        handleRejectInvite,
        handleStatusChange,
        filteredUsers
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
