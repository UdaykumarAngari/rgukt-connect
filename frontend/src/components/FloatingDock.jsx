import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { NAV_ITEMS } from '../data/navigation';

const FloatingDock = ({ onPlusClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadMessages } = useNotifications();

  const isActive = (path) => location.pathname === path;

  const leftItems = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    const unreadCount = item.badgeKey === 'unreadMessages' ? unreadMessages : 0;

    return (
      <button 
        key={item.id}
        onClick={() => navigate(item.path)}
        className={`p-2.5 rounded-full transition-colors cursor-pointer relative ${
          active ? 'text-rgukt-maroon' : 'text-slate-400 hover:text-slate-600'
        }`}
        title={item.label}
      >
        <Icon size={22} fill={active ? "currentColor" : "none"} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-rgukt-maroon text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-white shadow-sm shadow-rgukt-maroon/20 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <nav className="w-full flex items-center justify-around bg-white/90 backdrop-blur-md py-2 border-t border-slate-200 shadow-lg">
        {leftItems.map(renderNavItem)}

        <div className="relative px-2">
          <button 
            onClick={onPlusClick}
            className="bg-rgukt-maroon p-4 rounded-full -mt-10 border-4 border-rgukt-slate shadow-lg hover:scale-110 transition-transform cursor-pointer group"
          >
            <Plus size={28} className="text-rgukt-gold group-hover:rotate-90 transition-transform" strokeWidth={3} />
          </button>
        </div>

        {rightItems.map(renderNavItem)}
      </nav>
    </div>
  );
};

export default FloatingDock;