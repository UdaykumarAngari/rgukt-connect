import React from 'react';
import { Home, Users, Plus, Briefcase, MessageSquare } from 'lucide-react';

const FloatingDock = ({ activeTab, setActiveTab, onPlusClick }) => {
  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
      
      <nav className="flex items-center gap-1.5 md:gap-2.5 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-200 shadow-dock">
    
        <button 
          onClick={() => setActiveTab('home')}
          className={`p-2.5 rounded-full transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-rgukt-maroon' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home size={22} fill={activeTab === 'home' ? "currentColor" : "none"} />
        </button>
 
        <button 
          onClick={() => setActiveTab('network')}
          className={`p-2.5 rounded-full transition-colors cursor-pointer ${
            activeTab === 'network' ? 'text-rgukt-maroon' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users size={22} fill={activeTab === 'network' ? "currentColor" : "none"} />
        </button>

        <div className="relative px-2">
          {/* 2. ADD THE onClick HANDLER TO THIS BUTTON */}
          <button 
            onClick={onPlusClick}
            className="bg-rgukt-maroon p-4 rounded-full -mt-12 border-4 border-rgukt-slate shadow-lg hover:scale-110 transition-transform cursor-pointer group"
          >
            <Plus size={28} className="text-rgukt-gold group-hover:rotate-90 transition-transform" strokeWidth={3} />
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('jobs')}
          className={`p-2.5 rounded-full transition-colors cursor-pointer ${
            activeTab === 'jobs' ? 'text-rgukt-maroon' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Briefcase size={22} fill={activeTab === 'jobs' ? "currentColor" : "none"} />
        </button>

        <button 
          onClick={() => setActiveTab('messages')}
          className={`p-2.5 rounded-full transition-colors cursor-pointer ${
            activeTab === 'messages' ? 'text-rgukt-maroon' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MessageSquare size={22} fill={activeTab === 'messages' ? "currentColor" : "none"} />
        </button>

      </nav>
    </div>
  );
};

export default FloatingDock;