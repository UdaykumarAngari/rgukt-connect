import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import UserCard from '../components/UserCard';
import CreatePostModal from '../components/CreatePostModal';

// Data imports
import { mockUsers } from '../data/users';

const Network = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter logic for Users (Search by Name, Role, or Branch)
  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.branch?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-rgukt-slate flex flex-col">
      {/* Global Navbar */}
      <Navbar 
        isLanding={false} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
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

        {/* Directory Grid - 3 columns for a professional directory feel */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <UserCard key={user.id} user={user} />
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
            // Since this is the Network page, we'd typically redirect to Home 
            // after posting, or just console.log for now in mock mode.
            console.log("Post created from Network page:", newPost);
            setIsModalOpen(false);
        }}
      />

      <FloatingDock onPlusClick={() => setIsModalOpen(true)} />
    </div>
  );
};

export default Network;