import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const HomeContext = createContext(null);

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};

export const HomeProvider = ({ session, onLogout, children }) => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFeed = async () => {
    if (!session?.token) return;
    try {
      setLoading(true);
      const res = await axios.get('/api/posts', {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.token) {
      fetchFeed();
    } else {
      setPosts([]);
    }
  }, [session]);

  const handleCreatePost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setIsModalOpen(false);
  };

  const handleLikeToggle = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handleDeletePost = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== deletedPostId));
  };

  const filteredPosts = posts.filter(
    (p) =>
      (p.author && p.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.content && p.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <HomeContext.Provider
      value={{
        posts,
        setPosts,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        loading,
        fetchFeed,
        handleCreatePost,
        handleLikeToggle,
        handleDeletePost,
        filteredPosts,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
