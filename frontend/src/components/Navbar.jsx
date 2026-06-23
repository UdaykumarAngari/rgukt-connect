import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/rgukt.png'; 
import { Bell, Search } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import axios from 'axios';

const Navbar = ({ isLanding = false, searchQuery, setSearchQuery, session, onLogout }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const notificationRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    if (!session?.token) return;
    const fetchPhoto = async () => {
      try {
        const res = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${session.token}` }
        });
        setProfilePhoto(res.data.profilePhoto);
      } catch (err) {
        console.error('Failed to load profile photo in navbar:', err);
      }
    };
    fetchPhoto();
  }, [session]);

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

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        
        {/* LOGO - Clickable to go Home/Landing */}
        <div 
          onClick={() => navigate(session ? '/home' : '/')}
          className="flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <img src={logo} alt="Logo" className="h-9 w-auto" />
          <h1 className="text-xl font-bold text-charcoal tracking-tight hidden sm:block">
            RGUKT <span className="text-rgukt-maroon">Connect</span>
          </h1>
        </div>

        {!isLanding && (
          <div className="flex-1 max-w-md group hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400 group-focus-within:text-rgukt-maroon transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search alumni, skills, or posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
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
              {/* NOTIFICATIONS BUTTON */}
              <div ref={notificationRef} className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-full transition-colors relative cursor-pointer ${
                    showNotifications ? 'bg-rgukt-maroon/10 text-rgukt-maroon' : 'text-slate-400 hover:text-rgukt-maroon'
                  }`}
                >
                  <Bell size={22} />
                  {/* Notification Dot */}
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Dropdown Component */}
                <NotificationDropdown isOpen={showNotifications} />
              </div>
              
              {/* PROFILE AVATAR & DROPDOWN */}
              <div ref={profileDropdownRef} className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-9 h-9 rounded-full bg-rgukt-maroon/10 border border-rgukt-maroon/20 flex items-center justify-center text-rgukt-maroon font-black cursor-pointer hover:bg-rgukt-maroon hover:text-white transition-all duration-200 focus:outline-none overflow-hidden"
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
    </header>
  );
};

export default Navbar;