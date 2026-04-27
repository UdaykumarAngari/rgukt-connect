import React, { useState } from 'react';
import FloatingDock from './components/FloatingDock';  

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className= " min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-rgukt-maroon">
        RGUKT Connect
      </h1>
      <p className="text-slate-500 mt-2">
        Testing Strategy 1: Active Tab is {activeTab} 
      </p>

      <FloatingDock activeTab={activeTab} SetActiveTab={setActiveTab} />
    </div>
  );
}

export default App;