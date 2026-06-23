import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, UserPlus, Clock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user, session, onStatusChange }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('NOT_CONNECTED');
  const [connectionId, setConnectionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    // Avoid querying ourselves
    if (session.id === user.id) {
      setStatus('SELF');
      return;
    }
    try {
      const res = await axios.get(`/api/connections/status/${user.id}`, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setStatus(res.data.status);
      setConnectionId(res.data.connectionId || null);
    } catch (err) {
      console.error('Error fetching connection status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user.id, session.id]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/connections/request/${user.id}`, {}, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      await fetchStatus();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to send connection request.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!connectionId) return;
    setLoading(true);
    try {
      await axios.put(`/api/connections/accept/${connectionId}`, {}, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      await fetchStatus();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error(err);
      alert('Failed to accept connection request.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrDisconnect = async () => {
    if (!connectionId) return;
    const confirmMessage = status === 'ACCEPTED' 
      ? 'Are you sure you want to disconnect from this user?' 
      : 'Cancel connection request?';
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      await axios.delete(`/api/connections/reject/${connectionId}`, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      await fetchStatus();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error(err);
      alert('Failed to remove connection.');
    } finally {
      setLoading(false);
    }
  };

  const renderActionButton = () => {
    if (status === 'SELF') {
      return (
        <span className="w-full mt-5 inline-block text-xs font-bold text-slate-400 bg-slate-50 py-2 rounded-xl text-center border border-slate-100">
          This is You
        </span>
      );
    }

    switch (status) {
      case 'ACCEPTED':
        return (
          <button 
            onClick={handleCancelOrDisconnect}
            disabled={loading}
            className="w-full mt-5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-charcoal font-bold py-2 rounded-xl transition-all text-sm cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <UserCheck size={16} /> Connected
          </button>
        );
      case 'PENDING_SENT':
        return (
          <button 
            onClick={handleCancelOrDisconnect}
            disabled={loading}
            className="w-full mt-5 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-500 font-bold py-2 rounded-xl transition-all text-sm cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Clock size={16} /> Pending Cancel
          </button>
        );
      case 'PENDING_RECEIVED':
        return (
          <div className="w-full mt-5 flex gap-2">
            <button 
              onClick={handleAccept}
              disabled={loading}
              className="flex-1 bg-rgukt-maroon text-white font-bold py-2 rounded-xl hover:scale-[1.02] transition-transform text-xs cursor-pointer"
            >
              Accept
            </button>
            <button 
              onClick={handleCancelOrDisconnect}
              disabled={loading}
              className="flex-1 border border-slate-200 text-slate-600 font-bold py-2 rounded-xl hover:bg-slate-50 transition-all text-xs cursor-pointer"
            >
              Ignore
            </button>
          </div>
        );
      case 'NOT_CONNECTED':
      default:
        return (
          <button 
            onClick={handleConnect}
            disabled={loading}
            className="w-full mt-5 border border-rgukt-maroon text-rgukt-maroon hover:bg-rgukt-maroon hover:text-white font-bold py-2 rounded-xl transition-all text-sm cursor-pointer flex items-center justify-center gap-1.5"
          >
            <UserPlus size={16} /> Connect
          </button>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
      <div 
        onClick={() => navigate(`/profile?userId=${user.id}`)}
        className="relative mb-4 cursor-pointer hover:scale-105 transition-transform"
      >
        {user.avatar && user.avatar.length > 2 ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-20 h-20 rounded-full object-cover bg-slate-50 border-2 border-white ring-2 ring-slate-50" 
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-rgukt-slate border-2 border-white ring-2 ring-slate-50 flex items-center justify-center text-rgukt-maroon font-bold text-2xl shadow-sm">
            {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U'}
          </div>
        )}
        {user.isVerified && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            <ShieldCheck size={20} className="text-rgukt-gold fill-rgukt-gold/10" />
          </div>
        )}
      </div>

      <h4 
        onClick={() => navigate(`/profile?userId=${user.id}`)}
        className="font-bold text-charcoal truncate w-full cursor-pointer hover:text-rgukt-maroon hover:underline transition-colors"
      >
        {user.name}
      </h4>
      <p className="text-[11px] font-bold text-rgukt-maroon uppercase tracking-wider mt-1">
        {user.branch || 'CSE'} | Batch {user.batch || 'N/A'}
      </p>
      <p className="text-sm text-slate-500 mt-2 line-clamp-1">{user.role || 'Alumni'}</p>

      {user.companyLogo && (
        <div className="mt-3 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
          {user.companyLogo}
        </div>
      )}

      {renderActionButton()}
    </div>
  );
};

export default UserCard;