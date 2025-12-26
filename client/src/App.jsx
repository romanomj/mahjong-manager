import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainDisplay from './views/MainDisplay';
import AdminPanel from './views/AdminPanel';
import GuideView from './views/GuideView';
import RulesView from './views/RulesView';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation - visible for debugging or mobile users to switch views */}
        <nav style={{ background: '#333', padding: '10px' }}>
          <div className="nav-menu">
            <Link to="/" className="nav-link">Main HUD</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
            <Link to="/guide" className="nav-link">Scoring Guide</Link>
            <Link to="/rules" className="nav-link">Rules</Link>
          </div>
        </nav>

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
