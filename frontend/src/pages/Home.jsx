import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import axios from 'axios';

const Home = ({ session, onLogout }) => {
  // 1. STATE MANAGEMENT
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load feed from backend on mount
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get('/api/posts', {
          headers: { Authorization: `Bearer ${session?.token}` }
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch feed:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          onLogout();
        }
      }
    };

    if (session?.token) {
      fetchFeed();
    }
  }, [session, onLogout]);

  // 2. HANDLERS
  const handleCreatePost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setIsModalOpen(false);
  };

  const handleLikeToggle = (updatedPost) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const handleDeletePost = (deletedPostId) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== deletedPostId));
  };

  // 3. FILTER LOGIC
  const filteredPosts = posts.filter(p => 
    (p.author && p.author.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (p.content && p.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-rgukt-slate flex flex-col">
      {/* Global Navbar */}
      <Navbar 
        isLanding={false} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        session={session}
        onLogout={onLogout}
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
            <PostCard 
              key={post.id} 
              post={post} 
              session={session} 
              onLikeToggle={handleLikeToggle} 
              onDelete={handleDeletePost}
            />
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
        session={session}
      />

      <FloatingDock onPlusClick={() => setIsModalOpen(true)} />
    </div>
  );
};

export default Home;