import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';

// Data imports - Only need posts for this page
import { mockPosts as initialPosts } from '../data/posts';

const Home = () => {
  // 1. STATE MANAGEMENT
  const [posts, setPosts] = useState(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. HANDLERS
  const handleCreatePost = (newPost) => {
    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
  };

  // 3. FILTER LOGIC (Specifically for posts)
  const filteredPosts = posts.filter(p => 
    p.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-rgukt-slate flex flex-col">
      {/* Global Navbar */}
      <Navbar 
        isLanding={false} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pt-8 pb-60">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h2 className="text-2xl font-bold text-charcoal tracking-tight">Your Feed</h2>
            <p className="text-slate-500 text-sm mt-1">
              Latest updates from your campus network
            </p>
          </div>
          
          <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
            {filteredPosts.length} Posts
          </span>
        </div>

        {/* Feed Section - Centered single column for better readability */}
        <section className="max-w-2xl mx-auto space-y-6">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="bg-white p-20 rounded-[32px] border border-slate-100 text-center shadow-sm">
             <div className="text-4xl mb-4 opacity-20">📭</div>
             <p className="text-slate-400 italic">No posts found matching "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Overlays & Navigation */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreatePost}
      />

      <FloatingDock onPlusClick={() => setIsModalOpen(true)} />
    </div>
  );
};

export default Home;