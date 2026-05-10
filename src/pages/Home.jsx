// src/pages/Home.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import CreatePostModal from '../components/CreatePostModal';

// Initial data imports
import { mockPosts as initialPosts } from '../data/posts';
import { mockUsers } from '../data/users';

const Home = () => {
  // 1. STATE MANAGEMENT
  const [posts, setPosts] = useState(initialPosts); // Posts are now dynamic
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. HANDLERS
  const handleCreatePost = (newPost) => {
    // Adds the new post to the beginning of the array (Top of feed)
    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
  };

  // 3. FILTER LOGIC
  const filteredData = activeTab === 'home' 
    ? posts.filter(p => 
        p.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockUsers.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-rgukt-slate flex flex-col">
      <Navbar 
        isLanding={false} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-8 pb-60">
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h2 className="text-2xl font-bold text-charcoal capitalize tracking-tight">
              {activeTab === 'home' ? 'Your Feed' : 'Network Directory'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {activeTab === 'home' ? 'Updates from your network' : 'Connect with verified alumni'}
            </p>
          </div>
          
          <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
            {filteredData.length} {activeTab === 'home' ? 'Posts' : 'People'}
          </span>
        </div>

        {activeTab === 'home' ? (
          <section className="max-w-2xl mx-auto space-y-6">
            {filteredData.map(post => <PostCard key={post.id} post={post} />)}
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredData.map(user => <UserCard key={user.id} user={user} />)}
          </section>
        )}

        {filteredData.length === 0 && (
          <div className="bg-white p-20 rounded-[32px] border border-slate-100 text-center shadow-sm">
             <p className="text-slate-400 italic">No matches found for "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* MODAL & DOCK */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreatePost}
      />

      <FloatingDock 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onPlusClick={() => setIsModalOpen(true)} 
      />
    </div>
  );
};

export default Home;