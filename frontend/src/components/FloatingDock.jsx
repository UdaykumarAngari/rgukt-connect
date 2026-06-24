import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Plus, Briefcase, MessageSquare } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const FloatingDock = ({ onPlusClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadMessages } = useNotifications();

  // Helper function to check if the current URL matches the button path
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
      <nav className="flex items-center gap-1.5 md:gap-2.5 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-200 shadow-dock">
        
        {/* Home Button */}
        <button 
          onClick={() => navigate('/home')}
          className={`p-2.5 rounded-full transition-colors cursor-pointer ${
            isActive('/home') ? 'text-rgukt-maroon' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home size={22} fill={isActive('/home') ? "currentColor" : "none"} />
        </button>
 
        {/* Network Button */}
        <button 
          onClick={() => navigate('/network')}
          className={`p-2.5 rounded-full transition-colors cursor-pointer ${
            isActive('/network') ? 'text-rgukt-maroon' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users size={22} fill={isActive('/network') ? "currentColor" : "none"} />
        </button>

        {/* Create Post Button */}
        <div className="relative px-2">
          <button 
            onClick={onPlusClick}
            className="bg-rgukt-maroon p-4 rounded-full -mt-12 border-4 border-rgukt-slate shadow-lg hover:scale-110 transition-transform cursor-pointer group"
          >
            <Plus size={28} className="text-rgukt-gold group-hover:rotate-90 transition-transform" strokeWidth={3} />
          </button>
        </div>

        {/* Jobs Button */}
        <button 
          onClick={() => navigate('/jobs')}
          className={`p-2.5 rounded-full transition-colors cursor-pointer ${
            isActive('/jobs') ? 'text-rgukt-maroon' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Briefcase size={22} fill={isActive('/jobs') ? "currentColor" : "none"} />
        </button>

        {/* Messages Button */}
        <button 
          onClick={() => navigate('/messages')}
          className={`p-2.5 rounded-full transition-colors cursor-pointer relative ${
            isActive('/messages') ? 'text-rgukt-maroon' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MessageSquare size={22} fill={isActive('/messages') ? "currentColor" : "none"} />
          {unreadMessages > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-rgukt-maroon text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-white shadow-sm shadow-rgukt-maroon/20 animate-pulse">
              {unreadMessages}
            </span>
          )}
        </button>

      </nav>
    </div>
  );
};

export default FloatingDock;