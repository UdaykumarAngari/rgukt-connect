import React from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import UserCard from '../components/UserCard';
import CreatePostModal from '../components/CreatePostModal';
import { usePrompt } from '../context/PromptContext';
import { useNetwork } from '../context/NetworkContext';

const Network = ({ session, onLogout }) => {
  const { showPrompt } = usePrompt();
  
  const {
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    pendingInvites,
    loading,
    handleAcceptInvite,
    handleRejectInvite,
    handleStatusChange,
    filteredUsers,
  } = useNetwork();

  return (
    <div className="min-h-screen bg-rgukt-slate flex flex-col font-sans">
      <Navbar 
        isLanding={false} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        session={session}
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-8 pb-60">
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
                      onClick={() => handleAcceptInvite(invite.id, showPrompt)} 
                      className="bg-rgukt-maroon text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-[1.02] transition-transform cursor-pointer"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleRejectInvite(invite.id, showPrompt)} 
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

        {loading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col items-center text-center shadow-sm animate-pulse">
                <div className="w-20 h-20 rounded-full bg-slate-100 mb-4" />
                <div className="h-4 bg-slate-150 rounded-full w-2/3 mb-2" />
                <div className="h-3 bg-slate-100 rounded-full w-1/2 mb-3" />
                <div className="h-3 bg-slate-100 rounded-full w-3/4 mb-5" />
                <div className="h-9 bg-slate-100 rounded-xl w-full" />
              </div>
            ))}
          </section>
        ) : (
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
        )}
        {filteredUsers.length === 0 && (
          <div className="bg-white p-20 rounded-[32px] border border-slate-100 text-center shadow-sm">
             <div className="text-4xl mb-4 opacity-20">👥</div>
             <p className="text-slate-400 italic">No alumni found matching "{searchQuery}"</p>
          </div>
        )}
      </main>

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