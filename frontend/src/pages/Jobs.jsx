import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import JobCard from '../components/JobCard';
import CreateJobModal from '../components/CreateJobModal';

const Jobs = ({ session, onLogout }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  
  // Custom Alert / Confirm Prompt State
  const [promptConfig, setPromptConfig] = useState(null);

  const showPrompt = ({ type = 'alert', message, onConfirm }) => {
    setPromptConfig({ type, message, onConfirm });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/jobs', {
          headers: {
            Authorization: `Bearer ${session?.token}`
          }
        });
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs from API:", err);
        setJobs([]);
      }
    };
    fetchJobs();
  }, [session]);

  const filteredJobs = jobs.filter(j => 
    j.company?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAlumniOrAdmin = session?.role === 'ALUMNI' || session?.role === 'ADMIN';

  const handlePlusClick = () => {
    if (!isAlumniOrAdmin) {
      showPrompt({
        message: "Only Alumni or Admins can post job opportunities."
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleJobCreated = (newJob) => {
    setIsModalOpen(false);
    setJobs(prevJobs => [newJob, ...prevJobs]);
  };

  const handleJobDelete = async (jobId) => {
    try {
      await axios.delete(`/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${session?.token}`
        }
      });
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error("Error deleting job:", err);
      showPrompt({
        message: err.response?.data?.error || "Failed to delete job posting. Please try again."
      });
    }
  };

  return (
    <div className="min-h-screen bg-rgukt-slate flex flex-col">
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
            <h2 className="text-2xl font-bold text-charcoal tracking-tight">Career Opportunities</h2>
            <p className="text-slate-500 text-sm mt-1">
              Explore roles with alumni referrals and exclusive campus openings
            </p>
          </div>
          
          <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
            {filteredJobs.length} Positions
          </span>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              session={session}
              showPrompt={showPrompt}
              onDelete={handleJobDelete} 
            />
          ))}
        </section>
 
        {filteredJobs.length === 0 && (
          <div className="bg-white p-20 rounded-[32px] border border-slate-100 text-center shadow-sm">
             <div className="text-4xl mb-4 opacity-20">💼</div>
             <p className="text-slate-400 italic">No job openings found matching "{searchQuery}"</p>
          </div>
        )}
      </main>
 
      <CreateJobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleJobCreated}
        session={session}
        showPrompt={showPrompt}
      />

      <FloatingDock onPlusClick={handlePlusClick} />

      {/* Custom Premium Alert/Confirm Dialog */}
      {promptConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/30 backdrop-blur-[3px] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                promptConfig.type === 'confirm' ? 'bg-orange-50 text-orange-600' : 'bg-rgukt-maroon/5 text-rgukt-maroon'
              }`}>
                {promptConfig.type === 'confirm' ? (
                  <span className="text-xl font-bold">⚠️</span>
                ) : (
                  <span className="text-xl font-bold">ℹ️</span>
                )}
              </div>
              <h3 className="text-base font-bold text-charcoal mb-2">
                {promptConfig.type === 'confirm' ? 'Confirm Action' : 'Notification'}
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {promptConfig.message}
              </p>
            </div>
            <div className="flex gap-3">
              {promptConfig.type === 'confirm' && (
                <button
                  onClick={() => setPromptConfig(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  if (promptConfig.onConfirm) promptConfig.onConfirm();
                  setPromptConfig(null);
                }}
                className="flex-1 bg-rgukt-maroon text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-95 shadow-md shadow-maroon/10 transition-all cursor-pointer text-center"
              >
                {promptConfig.type === 'confirm' ? 'Delete' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;