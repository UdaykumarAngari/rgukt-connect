import React from 'react';
import { ShieldCheck, MessageSquare } from 'lucide-react';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="relative mb-4">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-20 h-20 rounded-full bg-slate-50 border-2 border-white ring-2 ring-slate-50" 
        />
        {user.isVerified && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            <ShieldCheck size={20} className="text-rgukt-gold fill-rgukt-gold/10" />
          </div>
        )}
      </div>

      <h4 className="font-bold text-charcoal">{user.name}</h4>
      <p className="text-[11px] font-bold text-rgukt-maroon uppercase tracking-wider mt-1">
        {user.branch} | Batch {user.batch}
      </p>
      <p className="text-sm text-slate-500 mt-2 line-clamp-1">{user.role}</p>

      {user.companyLogo && (
        <div className="mt-3 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
          {user.companyLogo}
        </div>
      )}

      <button className="w-full mt-5 border border-rgukt-maroon text-rgukt-maroon font-bold py-2 rounded-xl hover:bg-rgukt-maroon hover:text-white transition-all text-sm cursor-pointer">
        Connect
      </button>
    </div>
  );
};

export default UserCard;