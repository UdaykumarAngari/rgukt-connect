import React from 'react';
import logo from '../assets/rgukt.png'; 
import { Bell, Search } from 'lucide-react';

const Navbar = ({ isLanding = false, searchQuery, setSearchQuery }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        
        <div className="flex items-center gap-2 shrink-0">
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
        <div className="ml-auto flex items-center gap-3 shrink-0">
          {isLanding ? (
            <button className="bg-rgukt-maroon text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all cursor-pointer">
              Login
            </button>
          ) : (
            <>
              <button className="text-slate-400 hover:text-rgukt-maroon p-2 rounded-full transition-colors relative cursor-pointer">
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="w-9 h-9 rounded-full bg-rgukt-maroon/10 border border-rgukt-maroon/20 flex items-center justify-center text-rgukt-maroon font-bold cursor-pointer">
                UD
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;