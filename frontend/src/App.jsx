import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import Home from './pages/Home';
import Network from './pages/Network';
import Jobs from './pages/Jobs';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

// 🔐 Import your authentication pages (create these files inside your src/pages folder)
import Login from './pages/Login';
import Register from './pages/Register';

import Landing from './pages/Landing';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Check if a valid session already exists on application mount
  useEffect(() => {
    const cachedSession = localStorage.getItem('userSession');
    if (cachedSession) {
      setSession(JSON.parse(cachedSession));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (sessionData) => {
    setSession(sessionData);
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setSession(null);
  };

  // Prevent flashing private screens while reading localStorage
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Session Context...</div>;
  }

  // 🛡️ Protected Route Component wrapper
  const ProtectedRoute = ({ children }) => {
    if (!session) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <NotificationProvider session={session}>
      <BrowserRouter>
      <Routes>
        {/* Default route points to Landing page */}
        <Route path="/" element={<Landing session={session} onLogout={handleLogout} />} />
        
        {/* 🔓 Public / Auth Routes */}
        <Route 
          path="/login" 
          element={!session ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/home" replace />} 
        />
        <Route 
          path="/register" 
          element={!session ? <Register /> : <Navigate to="/home" replace />} 
        />

        {/* 🔒 Protected Functional Routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home session={session} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        
        <Route path="/network" element={
          <ProtectedRoute>
            <Network session={session} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        
        <Route path="/jobs" element={
          <ProtectedRoute>
            <Jobs session={session} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        
        <Route path="/messages" element={
          <ProtectedRoute>
            {/* 💬 This is where your Chat Engine lives! */}
            <Messages session={session} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile session={session} onLogout={handleLogout} />
          </ProtectedRoute>
        } />

        {/* Fallback for broken URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;