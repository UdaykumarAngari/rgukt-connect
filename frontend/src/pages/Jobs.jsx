import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import JobCard from '../components/JobCard';
import CreatePostModal from '../components/CreatePostModal';

// Data imports
import { mockJobs } from '../data/jobs';

const Jobs = ({ session, onLogout }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter logic for Jobs (Search by Company or Role)
  const filteredJobs = mockJobs.filter(j => 
    j.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.role.toLowerCase().includes(searchQuery.toLowerCase())
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

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-8 pb-60">
        {/* Page Header */}
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h2 className="text-2xl font-bold text-charcoal tracking-tight">Career Opportunities</h2>
            <p className="text-slate-500 text-sm mt-1">
              Explore roles with alumni referrals and exclusive campus openings
            </p>
          </div>
          
          <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
            {filteredJobs.length} Positions
          </span>
        </div>

        {/* Jobs Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="bg-white p-20 rounded-[32px] border border-slate-100 text-center shadow-sm">
             <div className="text-4xl mb-4 opacity-20">💼</div>
             <p className="text-slate-400 italic">No job openings found matching "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Post Modal */}
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

export default Jobs;