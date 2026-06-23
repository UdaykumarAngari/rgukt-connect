import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import UserCard from '../components/UserCard';
import CreatePostModal from '../components/CreatePostModal';
import axios from 'axios';
import { mockUsers } from '../data/users';

const Network = ({ session, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchPendingInvites = async () => {
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
    fetchPendingInvites();
  }, [session, refreshTrigger]);

  const handleAcceptInvite = async (requestId) => {
    try {
      await axios.put(`/api/connections/accept/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      fetchPendingInvites();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to accept request.');
    }
  };

  const handleRejectInvite = async (requestId) => {
    if (!window.confirm('Ignore this request?')) return;
    try {
      await axios.delete(`/api/connections/reject/${requestId}`, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      fetchPendingInvites();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to decline request.');
    }
  };

  const handleStatusChange = () => {
    fetchPendingInvites();
    setRefreshTrigger(prev => prev + 1);
  };

  // Filter logic for Users (Search by Name, Role, or Branch)
  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.branch?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-rgukt-slate flex flex-col font-sans">
      {/* Global Navbar */}
      <Navbar 
        isLanding={false} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        session={session}
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-8 pb-60">
        {/* Page Header */}
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h2 className="text-2xl font-bold text-charcoal tracking-tight">Alumni Directory</h2>
            <p className="text-slate-500 text-sm mt-1">
              Connect with verified seniors and peers from RGUKT
            </p>
          </div>
          
          <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
            {filteredUsers.length} People
          </span>
        </div>

        {/* Real Pending Invites Section */}
        {pendingInvites.length > 0 && (
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm mb-8">
            <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-rgukt-maroon animate-pulse"></span>
              Pending Invites ({pendingInvites.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pendingInvites.map(invite => (
                <div key={invite.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-rgukt-slate text-rgukt-maroon font-bold flex items-center justify-center text-sm shadow-sm border border-slate-200">
                      {invite.sender.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-charcoal text-xs truncate">{invite.sender.name}</h5>
                      <p className="text-[10px] text-slate-400">ID: {invite.sender.idNumber}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => handleAcceptInvite(invite.id)} 
                      className="bg-rgukt-maroon text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-[1.02] transition-transform cursor-pointer"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleRejectInvite(invite.id)} 
                      className="border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white transition-all cursor-pointer"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Directory Grid - 3 columns for a professional directory feel */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              session={session} 
              onStatusChange={handleStatusChange}
            />
          ))}
        </section>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="bg-white p-20 rounded-[32px] border border-slate-100 text-center shadow-sm">
             <div className="text-4xl mb-4 opacity-20">👥</div>
             <p className="text-slate-400 italic">No alumni found matching "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Modal - Kept here so the "+" button in the dock still works */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(newPost) => {
            setIsModalOpen(false);
            navigate('/home');
        }}
        session={session}
      />

      <FloatingDock onPlusClick={() => setIsModalOpen(true)} />
    </div>
  );
};

export default Network;