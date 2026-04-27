import React from 'react';
import { Home, Users, Plus, Briefcase, MessageSquare } from 'lucide-react';

const FloatingDock = ({ activeTab, setActiveTab }) => {
  // Navigation items array to keep the code clean
  const navItems = [
    { id: 'home', icon: Home },
    { id: 'network', icon: Users },
    { id: 'post', icon: Plus, isHero: true },
    { id: 'jobs', icon: Briefcase },
    { id: 'messages', icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-4">
      <nav className="flex items-center gap-2 md:gap-6 bg-white/80 backdrop-blur-lg px-4 py-2 md:px-6 md:py-3 rounded-full border border-slate-200 shadow-dock">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isHero) {
            return (
              <div key={item.id} className="relative px-2">
                <button className="bg-rgukt-maroon p-4 rounded-full -mt-12 border-4 border-rgukt-slate shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <Plus size={28} className="text-rgukt-gold" strokeWidth={3} />
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-full transition-all cursor-pointer ${
                activeTab === item.id ? 'text-rgukt-maroon bg-rgukt-maroon/5' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={24} fill={activeTab === item.id ? "currentColor" : "none"} />
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default FloatingDock;