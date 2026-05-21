import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeadForm from './components/LeadForm';
import AnalysisProgress from './components/AnalysisProgress';
import ReportDashboard from './components/ReportDashboard';
import AdminLeads from './components/AdminLeads';
import Footer from './components/Footer';

export default function App() {
  const [view, setView] = useState('form'); // 'form' | 'loading' | 'results' | 'admin'
  const [formData, setFormData] = useState(null);
  const [progressStep, setProgressStep] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  // Dynamic Loading Stepper Mock pacing (will fast-forward when API responds)
  useEffect(() => {
    let timer1, timer2, timer3, timer4;
    if (view === 'loading') {
      setProgressStep(1);
      
      timer1 = setTimeout(() => setProgressStep(2), 1500);
      timer2 = setTimeout(() => setProgressStep(3), 3200);
      timer3 = setTimeout(() => setProgressStep(4), 5000);
      timer4 = setTimeout(() => setProgressStep(5), 7500);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [view]);

  const handleSubmitLead = async (leadFormData) => {
    setFormData(leadFormData);
    setView('loading');
    setError(null);

    const startTime = Date.now();

    try {
      console.log('Posting lead data to workflow pipeline endpoint...');
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadFormData)
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Server rejected lead details.');
      }

      const data = await response.json();
      console.log('Workflow pipeline finished successfully! Data received:', data);

      // Fast-forward stepper UI to final steps
      setProgressStep(5);
      setTimeout(() => {
        setProgressStep(6);
        setTimeout(() => {
          setReportData(data);
          setView('results');
        }, 800);
      }, 600);

    } catch (err) {
      console.error('Workflow API request failed:', err);
      setError(err.message);
      setView('form');
      alert(`Pipeline Failed: ${err.message}`);
    }
  };

  const handleRestart = () => {
    setFormData(null);
    setReportData(null);
    setProgressStep(0);
    setError(null);
    setView('form');
  };

  return (
    <div className="app-container">
      {/* Dynamic Ambient Background Lights */}
      <div className="ambient-glow-wrapper">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      {/* Global Navigation Header */}
      <Header currentView={view} onViewChange={setView} />

      {/* Core Dashboard Interface */}
      <main className="main-content">
        
        {view === 'form' && (
          <div className="fade-in">
            <div style={{ textAlign: 'center', margin: '20px auto 40px auto', maxWidth: '800px' }}>
              <h1 className="hero-title">
                Automate Prospect <span className="text-gradient">Enrichment & Audits</span>
              </h1>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1.2rem', marginTop: '16px', lineHeight: '1.6' }}>
                Capture warm lead details. Instantly scrape assets, formulate strategic SWOT vectors, compile print-ready PDF reports, and deliver emails autonomously.
              </p>
            </div>
            
            <LeadForm onSubmit={handleSubmitLead} />
          </div>
        )}

        {view === 'loading' && (
          <AnalysisProgress 
            progressStep={progressStep} 
            companyWebsite={formData?.website} 
          />
        )}

        {view === 'results' && reportData && (
          <ReportDashboard 
            reportData={reportData} 
            onRestart={handleRestart} 
          />
        )}

        {view === 'admin' && (
          <AdminLeads />
        )}

      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
