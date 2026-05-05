 import React, { useState } from 'react'; 
import FloatingDock from './components/FloatingDock';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-rgukt-slate flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl text-center mb-16 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-rgukt-maroon">RGUKT Connect</h1>
        <p className="text-slate-500 mt-2">Connecting Batch 2008 to 2026</p>
        
        <div className="mt-8 pt-8 border-t border-slate-100">
           <p className="text-xs text-slate-400 uppercase tracking-widest">Currently Viewing</p>
           <p className="text-4xl font-extrabold text-charcoal capitalize mt-2 transition-all">
             {activeTab}
           </p>
        </div>
      </div>
      <FloatingDock activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;