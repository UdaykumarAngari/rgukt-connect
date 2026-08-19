import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProfileSummaryCard = ({ session }) => {
  const navigate = useNavigate();
  const { userProfile, profilePhoto } = useUser();

  const displayName = userProfile?.name || session?.name || 'User';
  const displayId = userProfile?.idNumber || session?.idNumber;
  const displayAvatar = profilePhoto || userProfile?.profilePhoto;
  const displayHeadline = userProfile?.description || (session?.role ? `${session.role.charAt(0) + session.role.slice(1).toLowerCase()} at RGUKT` : 'RGUKT Member');
  const displayBranch = userProfile?.branch;
  const displayBatch = userProfile?.batch;
  const roleBadge = session?.role;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden text-center transition-all hover:shadow-md">
     
      <div className="h-16 bg-gradient-to-r from-rgukt-maroon/15 via-rgukt-maroon/10 to-amber-500/10 relative" />

      <div className="px-5 pb-6 pt-0 relative -mt-9 flex flex-col items-center">
        <div 
          onClick={() => navigate('/profile')}
          className="w-18 h-18 rounded-full border-4 border-white bg-rgukt-maroon/10 text-rgukt-maroon flex items-center justify-center font-black text-lg shadow-sm overflow-hidden cursor-pointer hover:scale-105 transition-transform"
        >
          {displayAvatar ? (
            <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span>{getInitials(displayName)}</span>
          )}
        </div>
 
        <div className="mt-2.5 w-full">
          <h3 
            onClick={() => navigate('/profile')}
            className="font-bold text-charcoal text-sm hover:text-rgukt-maroon transition-colors cursor-pointer truncate"
            title={displayName}
          >
            {displayName}
          </h3>
          
          {displayHeadline && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed px-1">
              {displayHeadline}
            </p>
          )}
        </div>
 
        {(displayBranch || displayBatch || displayId || roleBadge) && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-50 w-full flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
            {displayBranch && (
              <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-lg">
                {displayBranch}
              </span>
            )}
            {displayBatch && (
              <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-lg">
                {displayBatch.toLowerCase().startsWith('batch') || displayBatch.toLowerCase().startsWith('20') ? displayBatch : `Batch ${displayBatch}`}
              </span>
            )}
            {displayId && (
              <span className="bg-slate-100 text-slate-500 font-mono font-medium px-2.5 py-0.5 rounded-lg">
                {displayId}
              </span>
            )}
            {!displayBranch && !displayBatch && roleBadge && (
              <span className="bg-rgukt-maroon/10 text-rgukt-maroon font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider text-[10px]">
                {roleBadge}
              </span>
            )}
          </div>
        )}
 
 
        <div className="mt-4 w-full">
          <button
            onClick={() => navigate('/profile')}
            className="w-full py-2 px-4 bg-slate-50 hover:bg-rgukt-maroon hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200/80 hover:border-rgukt-maroon transition-all cursor-pointer shadow-2xs"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummaryCard;
