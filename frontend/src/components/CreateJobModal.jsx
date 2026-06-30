import React, { useState } from 'react';
import { X, Loader2, Briefcase, DollarSign, MapPin, Tag } from 'lucide-react';
import axios from 'axios';

const CreateJobModal = ({ isOpen, onClose, onSubmit, session, showPrompt }) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [type, setType] = useState('Full-time');
  const [category, setCategory] = useState('Software');
  const [referralAvailable, setReferralAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !applyUrl.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/jobs', {
        company,
        role,
        location,
        salary,
        applyUrl,
        type,
        category,
        referralAvailable,
        expiresAt: expiresAt || null
      }, {
        headers: {
          Authorization: `Bearer ${session?.token}`
        }
      });

      onSubmit(res.data);
      
      // Reset form
      setCompany('');
      setRole('');
      setLocation('');
      setSalary('');
      setApplyUrl('');
      setExpiresAt('');
      setType('Full-time');
      setCategory('Software');
      setReferralAvailable(true);
    } catch (err) {
      console.error('Error creating job:', err);
      showPrompt({
        message: err.response?.data?.error || 'Failed to post job. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 bg-charcoal/20 backdrop-blur-[2px]">
      <div className="mt-16 bg-white w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rgukt-maroon/5 text-rgukt-maroon rounded-xl">
              <Briefcase size={20} />
            </div>
            <h3 className="font-bold text-charcoal text-lg">Post a Job Opening</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleJobSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Company Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-charcoal placeholder:text-slate-400 outline-none focus:border-slate-350 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Job Role / Title *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Software Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-charcoal placeholder:text-slate-400 outline-none focus:border-slate-350 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Location</label>
              <div className="relative flex items-center">
                <MapPin size={16} className="absolute left-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="e.g. Hyderabad / Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-slate-400 outline-none focus:border-slate-350 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Salary Range</label>
              <div className="relative flex items-center">
                <DollarSign size={16} className="absolute left-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="e.g. ₹15L - ₹18L or ₹25k/m"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-slate-400 outline-none focus:border-slate-350 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Job Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-charcoal outline-none focus:border-slate-350 focus:bg-white transition-all"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Category</label>
              <div className="relative flex items-center">
                <Tag size={16} className="absolute left-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="e.g. Software, DevOps, Web"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-slate-400 outline-none focus:border-slate-350 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Application Link / URL *</label>
              <input 
                type="text"
                required
                placeholder="e.g. https://careers.google.com/jobs/12345"
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-charcoal placeholder:text-slate-400 outline-none focus:border-slate-350 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Expiration Date</label>
              <input 
                type="date"
                value={expiresAt}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setExpiresAt(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-charcoal outline-none focus:border-slate-350 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center">
            <label className="relative flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={referralAvailable}
                onChange={(e) => setReferralAvailable(e.target.checked)}
                disabled={loading}
                className="w-4.5 h-4.5 rounded border-slate-300 text-rgukt-maroon focus:ring-rgukt-maroon/20 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-charcoal">Referral Available</span>
                <span className="text-xs text-slate-400">Check this if you can refer students directly in your organization.</span>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !company.trim() || !role.trim() || !applyUrl.trim()}
              className="bg-rgukt-maroon text-white px-8 py-2.5 rounded-xl font-bold hover:opacity-90 shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Posting...</span>
                </>
              ) : (
                <span>Post Job</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;
