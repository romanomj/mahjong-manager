import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainDisplay from './views/MainDisplay';
import AdminPanel from './views/AdminPanel';
import GuideView from './views/GuideView';
import RulesView from './views/RulesView';

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    setShowMenu(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 5000);
  };

  useEffect(() => {
    // Initial timer
    resetTimeout();

    const handleActivity = () => {
      resetTimeout();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Navigation - visible for debugging or mobile users to switch views */}
        <nav style={{ 
          background: '#333', 
          padding: '10px',
          opacity: showMenu ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          pointerEvents: showMenu ? 'auto' : 'none',
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000
        }}>
          <div className="nav-menu">
            <Link to="/" className="nav-link">Main HUD</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
            <Link to="/guide" className="nav-link">Scoring Guide</Link>
            <Link to="/rules" className="nav-link">Rules</Link>
          </div>
        </nav>
        {/* Spacer to prevent content from being hidden behind fixed nav when visible, 
            though for HUD we might want it overlaying. 
            Let's keep it overlaying for now as per "HUD" nature, 
            but maybe add some top padding to app-container if needed. 
            For now, just the nav change. */}

        <Routes>
          <Route path="/" element={<MainDisplay />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/guide" element={<GuideView />} />
          <Route path="/rules" element={<RulesView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
