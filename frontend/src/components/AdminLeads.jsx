import React, { useState, useEffect } from 'react';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/leads');
      if (!response.ok) {
        throw new Error('Failed to fetch lead logs from server.');
      }
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'hsl(142, 76%, 36%)'; // Emerald Green
    if (score >= 60) return 'hsl(38, 92%, 50%)'; // Amber Yellow
    return 'hsl(0, 84%, 60%)'; // Crimson Red
  };

  const getFullPdfUrl = (pdfUrl) => {
    if (!pdfUrl) return '#';
    if (pdfUrl.startsWith('/reports/')) {
      return `http://localhost:5000${pdfUrl}`;
    }
    return pdfUrl;
  };

  const filteredLeads = leads.filter(lead => {
    const q = search.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.companyName.toLowerCase().includes(q) ||
      lead.website.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
      
      {/* Header Panel */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '2rem' }}>Prospect Leads Database</h2>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginTop: '2px' }}>
            Auditing inbound lead traffic, technical indices, and email routing reports.
          </p>
        </div>

        <button onClick={fetchLeads} className="btn-outline" disabled={loading} style={{ padding: '10px 20px' }}>
          <span>Refresh Database</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: loading ? 'spin 2s linear infinite' : '' }}>
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
        </button>
      </div>

      {/* Leads Table Container */}
      <div className="glass-card" style={{ padding: '24px 0' }}>
        
        {/* Search Header */}
        <div style={{ padding: '0 24px 20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '280px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search leads by name, email, company or domain..."
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
            {/* Search Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '18px', color: 'hsl(var(--text-muted))' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', fontWeight: 'bold' }}>
            Showing {filteredLeads.length} of {leads.length} records
          </span>
        </div>

        {/* Dynamic States */}
        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid transparent', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
            <p>Loading database records...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>⚠️</span>
            <h4 style={{ color: 'hsl(var(--error))', fontSize: '1.1rem', marginTop: '12px', fontWeight: 'bold' }}>Database Connection Error</h4>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginTop: '4px' }}>{error}</p>
            <button onClick={fetchLeads} className="btn-primary" style={{ marginTop: '20px', padding: '10px 20px' }}>Try Again</button>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div style={{ padding: '80px 24px', textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>
            <span style={{ fontSize: '2.5rem' }}>📁</span>
            <h4 style={{ fontSize: '1.1rem', marginTop: '12px', fontWeight: 'bold', color: '#ffffff' }}>No Leads Captured Yet</h4>
            <p style={{ fontSize: '0.9rem', marginTop: '4px', maxWidth: '380px', margin: '4px auto 0 auto' }}>
              {search ? 'No records match your active filter search.' : 'Submit a lead through the Client Audit Portal form to populate this analytics dashboard.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={thStyle}>PROSPECT & COMPANY</th>
                  <th style={thStyle}>PRIMARY CHALLENGE</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>SEO</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>SPEED</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>CONV</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>OVERALL</th>
                  <th style={thStyle}>ROUTING STATUS</th>
                  <th style={thStyle}>SUBMISSION DATE</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid hsla(217, 30%, 15%, 0.4)', hover: { background: 'red' } }} className="table-row">
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.95rem' }}>{lead.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>{lead.email}</span>
                        <span style={{ fontSize: '0.8rem', color: 'hsl(var(--primary))', fontWeight: 'bold', marginTop: '4px' }}>
                          {lead.companyName} ({lead.website.replace(/^https?:\/\/(www\.)?/i, '')})
                        </span>
                      </div>
                    </td>
                    
                    <td style={{ ...tdStyle, maxWidth: '200px', fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.4' }}>
                      {lead.challenge}
                    </td>

                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={getScorePillStyle(lead.scores.seo)}>{lead.scores.seo}</span>
                    </td>
                    
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={getScorePillStyle(lead.scores.performance)}>{lead.scores.performance}</span>
                    </td>
                    
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={getScorePillStyle(lead.scores.leadGen)}>{lead.scores.leadGen}</span>
                    </td>
                    
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{ ...getScorePillStyle(lead.scores.overall), padding: '6px 12px', fontSize: '0.9rem', fontWeight: 'bold' }}>{lead.scores.overall}</span>
                    </td>

                    <td style={tdStyle}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: lead.status === 'Delivered' ? 'var(--success-glow)' : 'var(--error-glow)',
                        color: lead.status === 'Delivered' ? 'hsl(var(--success))' : 'hsl(var(--error))',
                        border: `1px solid ${lead.status === 'Delivered' ? 'hsl(var(--success))' : 'hsl(var(--error))'}`
                      }}>
                        {lead.status}
                      </span>
                    </td>

                    <td style={{ ...tdStyle, fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
                      {new Date(lead.timestamp).toLocaleString()}
                    </td>

                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <a 
                        href={getFullPdfUrl(lead.pdfUrl)} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn-outline" 
                        style={{ padding: '6px 12px', fontSize: '0.75rem', border: '1px solid var(--glass-border)' }}
                      >
                        PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
      
      {/* Styles for hover transition */}
      <style dangerouslySetInnerHTML={{__html: `
        .table-row {
          transition: background 0.2s ease;
        }
        .table-row:hover {
          background: hsla(222, 47%, 12%, 0.4);
        }
      `}} />

    </div>
  );
}

const thStyle = {
  padding: '16px 24px',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: 'hsl(var(--text-secondary))',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  borderBottom: '1px solid var(--glass-border)'
};

const tdStyle = {
  padding: '16px 24px',
  verticalAlign: 'middle',
  fontSize: '0.9rem'
};

const getScorePillStyle = (score) => {
  let color = 'hsl(0, 84%, 60%)';
  let bg = 'var(--error-glow)';
  
  if (score >= 80) {
    color = 'hsl(142, 76%, 36%)';
    bg = 'var(--success-glow)';
  } else if (score >= 60) {
    color = 'hsl(38, 92%, 50%)';
    bg = 'var(--warning-glow)';
  }
  
  return {
    fontSize: '0.8rem',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '4px',
    background: bg,
    color: color,
    border: `1px solid ${color}`
  };
};
