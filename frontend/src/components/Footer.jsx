import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--glass-border)',
      background: 'hsla(224, 71%, 3%, 0.9)',
      padding: '24px 20px',
      textAlign: 'center',
      marginTop: 'auto',
      fontSize: '0.85rem',
      color: 'hsl(var(--text-muted))'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span>SIMPLIFIQ ADVISORY GROUP © 2026. ALL RIGHTS RESERVED.</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="mailto:support@simplifiq.com" style={{ color: 'hsl(var(--text-muted))', textDecoration: 'none', transition: 'var(--transition-smooth)' }} onMouseOver={(e) => e.target.style.color = 'hsl(var(--primary))'} onMouseOut={(e) => e.target.style.color = 'hsl(var(--text-muted))'}>Contact Support</a>
          <span>|</span>
          <a href="mailto:partners@simplifiq.com" style={{ color: 'hsl(var(--text-muted))', textDecoration: 'none', transition: 'var(--transition-smooth)' }} onMouseOver={(e) => e.target.style.color = 'hsl(var(--primary))'} onMouseOut={(e) => e.target.style.color = 'hsl(var(--text-muted))'}>Partners Program</a>
        </div>
      </div>
    </footer>
  );
}
