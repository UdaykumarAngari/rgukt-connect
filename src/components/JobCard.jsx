// src/components/JobCard.jsx
import React from 'react';
import { MapPin, Briefcase, DollarSign, Send } from 'lucide-react';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          {/* Company Logo Placeholder */}
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400 text-xl">
            {job.logo}
          </div>
          <div>
            <h3 className="font-bold text-charcoal text-lg group-hover:text-rgukt-maroon transition-colors">
              {job.role}
            </h3>
            <p className="text-slate-500 font-medium">{job.company}</p>
          </div>
        </div>
        {job.referralAvailable && (
          <span className="bg-rgukt-gold/10 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Referral Available
          </span>
        )}
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
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
        <div className="flex flex-col">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Posted by</p>
            <p className="text-xs font-bold text-slate-600 truncate max-w-[100px]">
            {job.postedBy}
            </p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-rgukt-maroon text-white w-32 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer shadow-sm shadow-maroon/20 shrink-0">
            <span>Apply</span>
            <Send size={14} />
        </button>
        </div>
    </div>
  );
};

export default JobCard;