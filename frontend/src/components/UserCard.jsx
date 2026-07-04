import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, UserPlus, Clock, UserMinus } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from '../context/PromptContext';

const UserCard = ({ user, session, onStatusChange }) => {
  const navigate = useNavigate();
  const { showPrompt } = usePrompt();
  const [status, setStatus] = useState('NOT_CONNECTED');
  const [connectionId, setConnectionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const displayAvatar = user.profilePhoto || user.avatar;
  const displayRole = user.description || user.role || 'Alumni';

  const [showConfirm, setShowConfirm] = useState(false);

  const triggerCancelOrDisconnect = () => setShowConfirm(true);

  const getConfirmDetails = () => {
    switch (status) {
      case 'ACCEPTED':
        return {
          title: 'Remove Connection?',
          message: `Are you sure you want to disconnect from ${user.name}? You will no longer be able to message them directly.`,
          actionText: 'Disconnect'
        };
      case 'PENDING_SENT':
        return {
          title: 'Cancel Connection Request?',
          message: `Do you want to cancel your connection request to ${user.name}?`,
          actionText: 'Cancel Request'
        };
      case 'PENDING_RECEIVED':
      default:
        return {
          title: 'Ignore Connection Request?',
          message: `Are you sure you want to ignore the connection request from ${user.name}?`,
          actionText: 'Ignore Request'
        };
    }
  };

  const fetchStatus = async () => {
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
      showPrompt({ type: 'error', message: err.response?.data?.error || 'Failed to send connection request.' });
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
      showPrompt({ type: 'error', message: 'Failed to accept connection request.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrDisconnect = async () => {
    if (!connectionId) return;
    setShowConfirm(false);
    setLoading(true);
    try {
      await axios.delete(`/api/connections/reject/${connectionId}`, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      await fetchStatus();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error(err);
      showPrompt({ type: 'error', message: 'Failed to remove connection.' });
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
            onClick={triggerCancelOrDisconnect}
            disabled={loading}
            className="w-full mt-5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-charcoal font-bold py-2 rounded-xl transition-all text-sm cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <UserCheck size={16} /> Connected
          </button>
        );
      case 'PENDING_SENT':
        return (
          <button 
            onClick={triggerCancelOrDisconnect}
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
              onClick={triggerCancelOrDisconnect}
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

  const confirmDetails = getConfirmDetails();

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
        <div 
          onClick={() => navigate(`/profile?userId=${user.id}`)}
          className="relative mb-4 cursor-pointer hover:scale-105 transition-transform"
        >
          {displayAvatar && displayAvatar.length > 2 ? (
            <img 
              src={displayAvatar} 
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
        <p className="text-sm text-slate-500 mt-2 line-clamp-1">{displayRole}</p>

        {user.companyLogo && (
          <div className="mt-3 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
            {user.companyLogo}
          </div>
        )}

        {renderActionButton()}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-slate-100/80 animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <UserMinus size={24} />
            </div>
            
            <h3 className="text-base font-bold text-charcoal mb-2">
              {confirmDetails.title}
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              {confirmDetails.message}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelOrDisconnect}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-xs cursor-pointer shadow-sm shadow-red-100"
              >
                {confirmDetails.actionText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;