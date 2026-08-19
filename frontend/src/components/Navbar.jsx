import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logo from '../assets/rgukt.png'; 
import { Bell, Search, Plus } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import CreatePostModal from './CreatePostModal';
import { useNotifications } from '../context/NotificationContext';
import { useUser } from '../context/UserContext';
import { useHome } from '../context/HomeContext';
import { NAV_ITEMS } from '../data/navigation';

const Navbar = ({ isLanding = false, searchQuery, setSearchQuery, session, onLogout, onPlusClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { profilePhoto } = useUser();
  const homeContext = useHome();
  const notificationRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const { unreadNotifications, unreadMessages } = useNotifications();

  const [localSearchVal, setLocalSearchVal] = useState('');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (setSearchQuery) {
      setSearchQuery(val);
    } else {
      setLocalSearchVal(val);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!setSearchQuery) {
        navigate(`/home?search=${encodeURIComponent(localSearchVal)}`);
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  const handlePostClick = () => {
    if (onPlusClick) {
      onPlusClick();
    } else if (homeContext?.setIsModalOpen) {
      homeContext.setIsModalOpen(true);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const isModalHandledLocally = location.pathname === '/home' || location.pathname === '/network' || location.pathname === '/jobs';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 sm:px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-6 justify-between">
       
        <Link 
          to={session ? '/home' : '/'}
          className="flex items-center gap-2 shrink-0 cursor-pointer select-none focus:outline-none"
        >
          <img src={logo} alt="Logo" className="h-9 w-auto select-none" />
          <h1 className="text-lg sm:text-xl font-bold text-charcoal tracking-tight select-none">
            RGUKT <span className="text-rgukt-maroon">Connect</span>
          </h1>
        </Link>
 
        {!isLanding && (
          <div className="flex-1 max-w-xs lg:max-w-sm group hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400 group-focus-within:text-rgukt-maroon transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search alumni, skills, or posts..."
                value={setSearchQuery ? (searchQuery || '') : localSearchVal}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
        )}

        {!isLanding && session && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const unreadCount = item.badgeKey === 'unreadMessages' ? unreadMessages : 0;

              return (
                <button 
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer relative ${
                    active 
                      ? 'text-rgukt-maroon bg-rgukt-maroon/10 font-bold' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                  title={item.label}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon size={18} fill={active ? "currentColor" : "none"} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-rgukt-maroon text-white text-[9px] font-black h-4 min-w-4 px-1 rounded-full flex items-center justify-center border border-white shadow-xs animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
 
            <button 
              onClick={handlePostClick}
              className="flex items-center gap-1.5 bg-rgukt-maroon text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ml-1"
              title="Create Post"
            >
              <Plus size={15} className="text-rgukt-gold" strokeWidth={2.5} />
              <span className="hidden xl:inline">Post</span>
            </button>
          </nav>
        )}
 
        <div className="ml-auto flex items-center gap-3 shrink-0 relative">
          {isLanding && !session ? (
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/login')}
                className="border border-slate-200 text-slate-700 px-5 py-2 rounded-full font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-rgukt-maroon text-white px-5 py-2 rounded-full font-bold text-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <>
 
              <div ref={notificationRef} className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-full transition-colors relative cursor-pointer ${
                    showNotifications ? 'bg-rgukt-maroon/10 text-rgukt-maroon' : 'text-slate-400 hover:text-rgukt-maroon'
                  }`}
                  title="Notifications"
                >
                  <Bell size={22} />
              
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-rgukt-maroon text-white text-[9px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white shadow-sm shadow-rgukt-maroon/20 animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
 
                <NotificationDropdown 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                />
              </div>
             
              <div ref={profileDropdownRef} className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-9 h-9 rounded-full bg-rgukt-maroon/10 border border-rgukt-maroon/20 flex items-center justify-center text-rgukt-maroon font-black cursor-pointer hover:bg-rgukt-maroon hover:text-white transition-all duration-200 focus:outline-none overflow-hidden"
                  title="Profile menu"
                >
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={session?.name} className="w-full h-full object-cover" />
                  ) : (
                    session ? getInitials(session.name) : 'UD'
                  )}
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-50">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-extrabold text-charcoal truncate">{session?.name || 'User'}</p>
                      <p className="text-xs text-slate-400 truncate">{session?.universityEmail || ''}</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        navigate('/profile');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-rgukt-maroon transition-all font-bold flex items-center gap-2 cursor-pointer"
                    >
                      View Profile
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        if (onLogout) {
                          onLogout();
                        } else {
                          localStorage.removeItem('userSession');
                          window.location.href = '/';
                        }
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all font-bold flex items-center gap-2 cursor-pointer border-t border-slate-50"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
 
      {homeContext?.isModalOpen && !isModalHandledLocally && (
        <CreatePostModal
          isOpen={homeContext.isModalOpen}
          onClose={() => homeContext.setIsModalOpen(false)}
          onSubmit={(newPost) => {
            homeContext.handleCreatePost(newPost);
            navigate('/home');
          }}
          session={session}
        />
      )}
    </header>
  );
};

export default Navbar;