import React, { useState } from 'react';

export default function Header({ currentView, onViewChange }) {
  const [open, setOpen] = useState(false);

  const handleNavClick = (view) => {
    onViewChange(view);
    setOpen(false);
  };
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => onViewChange('form')}>
          <div className="logo-dot" />
          <span>SIMPLIFIQ</span>
          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--primary))', fontWeight: 'bold', alignSelf: 'flex-start', marginTop: '2px' }}>AI</span>
        </div>

        <button className="nav-toggle" onClick={() => setOpen(prev => !prev)} aria-expanded={open} aria-label="Toggle navigation">
          ☰
        </button>

        <div className={`nav-actions ${open ? 'open' : ''}`}>
          <button
            className={`btn-outline ${currentView === 'form' || currentView === 'results' ? 'active' : ''}`}
            onClick={() => handleNavClick('form')}
            style={{
              border: 'none',
              color: currentView === 'form' || currentView === 'results' ? '#ffffff' : 'hsl(var(--text-secondary))',
              background: currentView === 'form' || currentView === 'results' ? 'var(--primary-glow)' : 'transparent',
              padding: '8px 16px',
              fontSize: '0.85rem'
            }}
          >
            Client Audit Portal
          </button>

          <button
            className={`btn-outline ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin')}
            style={{
              border: 'none',
              color: currentView === 'admin' ? '#ffffff' : 'hsl(var(--text-secondary))',
              background: currentView === 'admin' ? 'var(--primary-glow)' : 'transparent',
              padding: '8px 16px',
              fontSize: '0.85rem'
            }}
          >
            Admin Leads
          </button>
        </div>
      </div>
    </nav>
  );
}
