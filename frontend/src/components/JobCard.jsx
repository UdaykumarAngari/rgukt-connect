import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Send, Trash2, Calendar } from 'lucide-react';

const JobCard = ({ job, session, showPrompt, onDelete }) => {
  const navigate = useNavigate();
  const isExpired = job.expiresAt && new Date(job.expiresAt) < new Date();

  const handleApplyClick = () => {
    if (isExpired) return;
    if (job.applyUrl) {
      let url = job.applyUrl.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      showPrompt({
        message: "No application link has been provided for this job."
      });
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    showPrompt({
      type: 'confirm',
      message: `Are you sure you want to delete the job posting for "${job.role}" at "${job.company}"?`,
      onConfirm: () => onDelete(job.id)
    });
  };

  return (
    <div className={`bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between ${isExpired ? 'opacity-75' : ''}`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-rgukt-maroon text-xl select-none">
              {job.logo || (job.company ? job.company[0] : 'J')}
            </div>
            <div>
              <h3 className="font-bold text-charcoal text-lg group-hover:text-rgukt-maroon transition-colors">
                {job.role}
              </h3>
              <p className="text-slate-500 font-medium">{job.company}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {job.referralAvailable && (
              <span className="bg-rgukt-gold/10 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Referral
              </span>
            )}
            {isExpired && (
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Expired
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <MapPin size={16} /> {job.location}
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Briefcase size={16} /> {job.type}
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <DollarSign size={16} className="text-green-600" /> {job.salary}
          </div>
          {job.expiresAt && (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Calendar size={16} /> 
              <span className={isExpired ? 'text-red-500 font-medium' : ''}>
                {isExpired ? 'Expired' : `Ends: ${new Date(job.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => navigate(`/profile?userId=${job.postedById}`)}
            className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
            title={`View ${job.postedBy}'s profile`}
          >
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Posted by</p>
              <p className="text-xs font-bold text-slate-600 hover:text-rgukt-maroon transition-colors truncate max-w-[100px]">
              {job.postedBy}
              </p>
          </div>
          {(session?.id === job.postedById || session?.role === 'ADMIN') && (
            <button 
              onClick={handleDeleteClick}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer mt-1"
              title="Delete Job Posting"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <button 
          onClick={handleApplyClick}
          disabled={isExpired}
          className={`flex items-center justify-center gap-2 w-32 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm shrink-0 ${
            isExpired 
              ? 'bg-slate-105 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' 
              : 'bg-rgukt-maroon text-white hover:opacity-90 shadow-maroon/20'
          }`}
        >
            <span>{isExpired ? 'Expired' : 'Apply'}</span>
            {!isExpired && <Send size={14} />}
        </button>
      </div>
    </div>
  );
};

export default JobCard;