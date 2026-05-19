import React, { useState } from 'react';

export default function ReportDashboard({ reportData, onRestart }) {
  const { leadId, pdfUrl, emailPreviewUrl, scraped, analysis } = reportData;
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return 'hsl(142, 76%, 36%)'; // Emerald Green
    if (score >= 60) return 'hsl(38, 92%, 50%)'; // Amber Yellow
    return 'hsl(0, 84%, 60%)'; // Crimson Red
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'hsl(0, 84%, 60%)';
      case 'medium': return 'hsl(38, 92%, 50%)';
      default: return 'hsl(142, 76%, 36%)';
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(analysis.outreachEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert local relative PDF url to full server url if needed
  const getFullPdfUrl = () => {
    if (pdfUrl.startsWith('/reports/')) {
      return `http://localhost:5000${pdfUrl}`;
    }
    return pdfUrl;
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* 1. Header Banner Card */}
      <div className="glass-card" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '20px',
        borderLeft: '4px solid hsl(var(--primary))'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--primary))', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Audit Reference: {leadId}
          </span>
          <h2 style={{ fontSize: '2rem', marginTop: '4px' }}>
            {scraped.domain.toUpperCase()} Digital Audit
          </h2>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginTop: '2px' }}>
            Personalized Diagnostic Report compiled on {new Date().toLocaleDateString()}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onRestart} className="btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Analyze New Site</span>
          </button>
          
          <a href={getFullPdfUrl()} target="_blank" rel="noreferrer" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download Report PDF</span>
          </a>
        </div>
      </div>

      {/* Ethereal Inbox Warning / Tester Preview */}
      {emailPreviewUrl && (
        <div style={{
          background: 'hsla(38, 92%, 50%, 0.08)',
          border: '1px solid hsla(38, 92%, 50%, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }} className="fade-in">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '1.6rem' }}>📬</span>
            <div>
              <h4 style={{ color: 'hsl(var(--warning))', fontSize: '1rem', fontWeight: 'bold' }}>SMTP Test Sandbox Active (Zero-Config Mode)</h4>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem', marginTop: '2px', lineHeight: '1.4' }}>
                We generated a virtual Ethereal Mail sandbox and successfully sent the email delivery with the attached PDF report.
              </p>
            </div>
          </div>
          <a href={emailPreviewUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ 
            background: 'linear-gradient(135deg, hsl(var(--warning)) 0%, #b45309 100%)',
            boxShadow: '0 4px 14px 0 rgba(217, 119, 6, 0.3)'
          }}>
            <span>Preview Delivered Email</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      )}

      {/* 2. Overview Summary and Scorecards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        
        {/* Left Side: Summary Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'hsl(var(--primary))' }}>DIGITAL FOOTPRINT SUMMARY</h3>
            <div style={{ width: '40px', height: '3px', background: 'hsl(var(--primary))', marginTop: '6px' }}></div>
          </div>
          
          <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'hsl(var(--text-primary))' }}>
            {analysis.businessSummary}
          </p>

          <div style={{ 
            marginTop: '10px',
            padding: '16px', 
            background: 'hsla(222, 47%, 6%, 0.5)', 
            border: '1px solid var(--glass-border)', 
            borderRadius: '8px' 
          }}>
            <h4 style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', marginBottom: '8px' }}>CORE AUDIENCE PENETRATION</h4>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'hsl(var(--text-primary))' }}>
              {analysis.targetAudienceAnalysis}
            </p>
          </div>
        </div>

        {/* Right Side: Score Card Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* SEO Metric */}
          <div className="glass-card" style={{ textAlign: 'center', padding: '24px 16px', borderTop: `4px solid ${getScoreColor(scraped.scores.seo)}` }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'hsl(var(--text-secondary))', letterSpacing: '1px' }}>SEO SCORE</span>
            <h1 style={{ fontSize: '3rem', color: getScoreColor(scraped.scores.seo), margin: '8px 0' }}>{scraped.scores.seo}</h1>
            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Technical Tag Coverage</p>
          </div>

          {/* Performance Metric */}
          <div className="glass-card" style={{ textAlign: 'center', padding: '24px 16px', borderTop: `4px solid ${getScoreColor(scraped.scores.performance)}` }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'hsl(var(--text-secondary))', letterSpacing: '1px' }}>SPEED INDEX</span>
            <h1 style={{ fontSize: '3rem', color: getScoreColor(scraped.scores.performance), margin: '8px 0' }}>{scraped.scores.performance}</h1>
            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>{scraped.loadTimeMs}ms Response Time</p>
          </div>

          {/* Conversion Metric */}
          <div className="glass-card" style={{ textAlign: 'center', padding: '24px 16px', borderTop: `4px solid ${getScoreColor(scraped.scores.leadGen)}` }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'hsl(var(--text-secondary))', letterSpacing: '1px' }}>CONVERSION</span>
            <h1 style={{ fontSize: '3rem', color: getScoreColor(scraped.scores.leadGen), margin: '8px 0' }}>{scraped.scores.leadGen}</h1>
            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Form & Contact Depth</p>
          </div>

          {/* Overall Composite Metric */}
          <div className="glass-card" style={{ 
            textAlign: 'center', 
            padding: '24px 16px', 
            borderTop: `4px solid hsl(var(--primary))`,
            background: 'linear-gradient(180deg, var(--glass-bg) 0%, var(--primary-glow) 100%)'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ffffff', letterSpacing: '1px' }}>OVERALL GRADE</span>
            <h1 style={{ fontSize: '3.2rem', color: '#ffffff', margin: '6px 0', textShadow: '0 0 15px rgba(2, 132, 199, 0.4)' }}>{scraped.scores.overall}</h1>
            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>Composite Score</p>
          </div>

        </div>

      </div>

      {/* 3. SWOT Matrix Visualization */}
      <div className="glass-card">
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'hsl(var(--primary))' }}>SWOT STRATEGY MATRIX</h3>
          <div style={{ width: '40px', height: '3px', background: 'hsl(var(--primary))', marginTop: '6px' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Strengths Box */}
          <div style={{
            background: 'hsla(142, 76%, 36%, 0.04)',
            border: '1px solid hsla(142, 76%, 36%, 0.2)',
            borderTop: '3px solid hsl(142, 76%, 36%)',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h4 style={{ color: 'hsl(142, 76%, 36%)', fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px' }}>STRENGTHS (Internal)</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px', fontSize: '0.9rem', color: 'hsl(var(--text-primary))', lineHeight: '1.4' }}>
              {analysis.swot.strengths.map((pt, idx) => <li key={idx}>{pt}</li>)}
            </ul>
          </div>

          {/* Weaknesses Box */}
          <div style={{
            background: 'hsla(0, 84%, 60%, 0.04)',
            border: '1px solid hsla(0, 84%, 60%, 0.2)',
            borderTop: '3px solid hsl(0, 84%, 60%)',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h4 style={{ color: 'hsl(0, 84%, 60%)', fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px' }}>WEAKNESSES (Internal)</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px', fontSize: '0.9rem', color: 'hsl(var(--text-primary))', lineHeight: '1.4' }}>
              {analysis.swot.weaknesses.map((pt, idx) => <li key={idx}>{pt}</li>)}
            </ul>
          </div>

          {/* Opportunities Box */}
          <div style={{
            background: 'hsla(199, 95%, 58%, 0.04)',
            border: '1px solid hsla(199, 95%, 58%, 0.2)',
            borderTop: '3px solid hsl(199, 95% ,58%)',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h4 style={{ color: 'hsl(199, 95%, 58%)', fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px' }}>OPPORTUNITIES (External)</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px', fontSize: '0.9rem', color: 'hsl(var(--text-primary))', lineHeight: '1.4' }}>
              {analysis.swot.opportunities.map((pt, idx) => <li key={idx}>{pt}</li>)}
            </ul>
          </div>

          {/* Threats Box */}
          <div style={{
            background: 'hsla(38, 92%, 50%, 0.04)',
            border: '1px solid hsla(38, 92%, 50%, 0.2)',
            borderTop: '3px solid hsl(38, 92%, 50%)',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h4 style={{ color: 'hsl(38, 92%, 50%)', fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px' }}>THREATS (External)</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px', fontSize: '0.9rem', color: 'hsl(var(--text-primary))', lineHeight: '1.4' }}>
              {analysis.swot.threats.map((pt, idx) => <li key={idx}>{pt}</li>)}
            </ul>
          </div>

        </div>
      </div>

      {/* 4. Action Plan List */}
      <div className="glass-card">
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'hsl(var(--primary))' }}>PRIORITIZED ROADMAP FOR GROWTH</h3>
          <div style={{ width: '40px', height: '3px', background: 'hsl(var(--primary))', marginTop: '6px' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {analysis.actionPlan.map((action, idx) => {
            const priorityColor = getPriorityColor(action.priority);
            return (
              <div 
                key={idx}
                style={{ 
                  background: 'hsla(222, 47%, 6%, 0.4)', 
                  border: '1px solid var(--glass-border)', 
                  borderLeft: `4px solid ${priorityColor}`,
                  borderRadius: '0 8px 8px 0',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 'bold', 
                      background: `hsla(${action.priority.toLowerCase() === 'high' ? '0' : action.priority.toLowerCase() === 'medium' ? '38' : '142'}, 80%, 45%, 0.15)`,
                      color: priorityColor,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      letterSpacing: '1px'
                    }}>
                      {action.priority.toUpperCase()} PRIORITY
                    </span>
                    <h4 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{action.task}</h4>
                  </div>

                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: priorityColor }}>
                    Projected Outcome: {action.estimatedRoi}
                  </span>
                </div>

                <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginTop: '10px', lineHeight: '1.5' }}>
                  {action.details}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Outreach Copy / Script section */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'hsl(var(--primary))' }}>B2B OUTREACH EMAIL SCRIPT</h3>
            <div style={{ width: '40px', height: '3px', background: 'hsl(var(--primary))', marginTop: '6px' }}></div>
          </div>
          
          <button onClick={handleCopyEmail} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            {copied ? '✓ Copied' : 'Copy Script to Clipboard'}
          </button>
        </div>

        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.4' }}>
          Below is the personalized outreach template generated by the AI based on this website diagnostic review. Sales teams can use this template to book a follow-up advisory strategy call with the prospect.
        </p>

        <pre style={{
          background: 'hsla(222, 47%, 4%, 0.8)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '20px',
          color: '#e2e8f0',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          fontFamily: 'Consolas, Monaco, monospace'
        }}>
          {analysis.outreachEmail}
        </pre>
      </div>

    </div>
  );
}
