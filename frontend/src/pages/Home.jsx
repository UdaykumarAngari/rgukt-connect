import React from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import ProfileSummaryCard from '../components/ProfileSummaryCard';
import { useHome } from '../context/HomeContext';

const Home = ({ session, onLogout }) => {
  const {
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    handleCreatePost,
    handleLikeToggle,
    handleDeletePost,
    filteredPosts,
  } = useHome();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchVal = params.get('search');
    if (searchVal) {
      setSearchQuery(searchVal);
      // Clean up the URL search parameter to keep URL clean
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setSearchQuery]);

  return (
    <div className="h-screen md:min-h-screen md:h-auto bg-rgukt-slate flex flex-col overflow-hidden md:overflow-visible">
      <Navbar
        isLanding={false}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        session={session}
        onLogout={onLogout}
        onPlusClick={() => setIsModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto md:overflow-visible min-h-0 md:min-h-auto w-full max-w-6xl mx-auto px-2 pt-8 pb-32 md:pb-60 flex justify-center gap-8 items-start">
        <aside className="hidden lg:block w-72 shrink-0 sticky top-20">
          <ProfileSummaryCard session={session} />
        </aside>
 
        <div className="flex-1 max-w-2xl min-w-0">
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

          <section className="space-y-6">
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

          {filteredPosts.length === 0 && (
            <div className="bg-white p-20 rounded-[32px] border border-slate-100 text-center shadow-sm">
              <div className="text-4xl mb-4 opacity-20">📭</div>
              <p className="text-slate-400 italic">No posts found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

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