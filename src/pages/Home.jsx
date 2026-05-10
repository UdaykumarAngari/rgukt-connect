import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import { mockPosts } from '../data/posts';
import { mockUsers } from '../data/users';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState('home');
 
  const filteredData = activeTab === 'home' 
    ? mockPosts.filter(p => p.author.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-rgukt-slate">
      <Navbar isLanding={false} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="max-w-4xl mx-auto px-4 pt-8 pb-60">
        <h2 className="text-xl font-bold text-charcoal capitalize mb-6 px-2">
          {activeTab === 'home' ? 'Your Feed' : 'Alumni Directory'}
        </h2>

        {activeTab === 'home' ? (
          <section className="max-w-2xl mx-auto space-y-6">
            {filteredData.map(post => <PostCard key={post.id} post={post} />)}
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredData.map(user => <UserCard key={user.id} user={user} />)}
          </section>
        )}
      </main>

      <FloatingDock activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Home;