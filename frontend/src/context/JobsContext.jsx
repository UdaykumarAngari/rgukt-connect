import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const JobsContext = createContext(null);

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};

export const JobsProvider = ({ session, onLogout, children }) => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    if (!session?.token) return;
    try {
      setLoading(true);
      const res = await axios.get('/api/jobs', {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs from API:', err);
      setJobs([]);
      if (err.response?.status === 401 || err.response?.status === 403) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.token) {
      fetchJobs();
    } else {
      setJobs([]);
    }
  }, [session]);

  const handleJobCreated = (newJob) => {
    setJobs((prevJobs) => [newJob, ...prevJobs]);
    setIsModalOpen(false);
  };

  const handleJobDelete = async (jobId, showPrompt) => {
    try {
      await axios.delete(`/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
      if (showPrompt) {
        showPrompt({
          message: err.response?.data?.error || 'Failed to delete job posting. Please try again.',
        });
      }
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <JobsContext.Provider
      value={{
        jobs,
        setJobs,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        loading,
        fetchJobs,
        handleJobCreated,
        handleJobDelete,
        filteredJobs,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};
