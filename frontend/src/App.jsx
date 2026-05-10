import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Network from './pages/Network';
import Jobs from './pages/Jobs';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to /home */}
        <Route path="/" element={<Navigate to="/home" />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/network" element={<Network />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;