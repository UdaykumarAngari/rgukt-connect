import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { PromptProvider } from './context/PromptContext';
import Home from './pages/Home';
import Network from './pages/Network';
import Jobs from './pages/Jobs';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import Landing from './pages/Landing';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
 
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
 
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Session Context...</div>;
  }

  const ProtectedRoute = ({ children }) => {
    if (!session) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <NotificationProvider session={session}>
      <PromptProvider>
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing session={session} onLogout={handleLogout} />} />
 
        <Route 
          path="/login" 
          element={!session ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/home" replace />} 
        />
        <Route 
          path="/register" 
          element={!session ? <Register /> : <Navigate to="/home" replace />} 
        />
        <Route 
          path="/forgot-password" 
          element={!session ? <ForgotPassword /> : <Navigate to="/home" replace />} 
        />
 
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
            <Messages session={session} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile session={session} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
      </PromptProvider>
      <Analytics />
    </NotificationProvider>
  );
}

export default App;