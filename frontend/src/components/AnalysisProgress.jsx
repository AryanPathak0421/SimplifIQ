import React, { useState, useEffect } from 'react';

const PIPELINE_STEPS = [
  { id: 1, label: 'Validating Lead Integrity & Headers', desc: 'Running validation checks on email constraints and domain structures.' },
  { id: 2, label: 'Crawling Company Domain Assets', desc: 'Scraping home page text copy, layout structures, image alt attributes, and speed metrics.' },
  { id: 3, label: 'Invoking Gemini AI Advisory Diagnostic', desc: 'Performing SWOT matrix reasoning, lead acquisition audits, and action plan ROIs.' },
  { id: 4, label: 'Compiling Customized Strategy PDF', desc: 'Assembling graphics, styled metrics tables, and dynamic scoring into a print-ready vector file.' },
  { id: 5, label: 'Routing Deliverables & Email Transmission', desc: 'Constructing personalized HTML advisory outreach and attaching compiled strategy document.' },
  { id: 6, label: 'Archiving Metrics & Logging Audit Session', desc: 'Uploading PDF to public containers and syncing lead parameters with central tracking sheet.' }
];

export default function AnalysisProgress({ progressStep, companyWebsite }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Smooth transition from currentStep to progressStep
    if (progressStep > currentStep) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < progressStep) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [progressStep, currentStep]);

  const percent = Math.min(100, Math.round((currentStep / PIPELINE_STEPS.length) * 100));

  return (
    <div className="glass-card fade-in" style={{ maxWidth: '640px', margin: '40px auto 0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          Automating Growth Analysis
        </h2>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
          Running target-outcome synthesis for <span style={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}>{companyWebsite}</span>
        </p>

        {/* Big circular loader indicator */}
        <div style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          margin: '30px auto',
          borderRadius: '50%',
          background: 'radial-gradient(circle, hsla(200, 98%, 48%, 0.1) 0%, transparent 70%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid hsla(217, 30%, 20%, 0.5)'
        }}>
          {/* Animated Spinner Ring */}
          <div style={{
            position: 'absolute',
            width: '108px',
            height: '108px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: 'hsl(var(--primary))',
            animation: 'spin 1.5s linear infinite'
          }}></div>
          
          <span style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-header)' }}>
            {percent}%
          </span>
        </div>
      </div>

      {/* Stepper Pipeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '10px' }}>
        {/* Stepper Center Connecting line */}
        <div style={{
          position: 'absolute',
          left: '21px',
          top: '20px',
          bottom: '20px',
          width: '2px',
          background: 'hsla(217, 30%, 20%, 0.6)',
          zIndex: 1
        }}>
          {/* Active progress track */}
          <div style={{
            height: `${Math.max(0, ((currentStep - 1) / (PIPELINE_STEPS.length - 1)) * 100)}%`,
            width: '100%',
            background: 'hsl(var(--primary))',
            boxShadow: '0 0 10px 0 hsl(var(--primary))',
            transition: 'height 0.8s ease'
          }}></div>
        </div>

        {PIPELINE_STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;

          let badgeBg = 'hsla(222, 47%, 6%, 0.6)';
          let badgeBorder = '1px solid var(--glass-border)';
          let badgeText = 'hsl(var(--text-muted))';
          let titleColor = 'hsl(var(--text-muted))';

          if (isDone) {
            badgeBg = 'var(--success-glow)';
            badgeBorder = '1px solid hsl(var(--success))';
            badgeText = 'hsl(var(--success))';
            titleColor = 'hsl(var(--text-primary))';
          } else if (isActive) {
            badgeBg = 'var(--primary-glow)';
            badgeBorder = '2px solid hsl(var(--primary))';
            badgeText = 'hsl(var(--primary))';
            titleColor = '#ffffff';
          }

          return (
            <div key={step.id} style={{ display: 'flex', gap: '20px', zIndex: 2, position: 'relative' }}>
              {/* Node Circle */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: badgeBg,
                border: badgeBorder,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: badgeText,
                fontWeight: 'bold',
                fontSize: '0.8rem',
                flexShrink: 0,
                marginTop: '2px',
                transition: 'all 0.5s ease',
                boxShadow: isActive ? '0 0 12px 0 hsl(var(--primary))' : ''
              }}>
                {isDone ? '✓' : step.id}
              </div>

              {/* Step Info */}
              <div style={{ transition: 'all 0.5s ease' }}>
                <h4 style={{ color: titleColor, fontSize: '0.95rem', fontWeight: isActive || isDone ? '600' : '400' }}>
                  {step.label}
                </h4>
                {isActive && (
                  <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.8rem', marginTop: '4px', lineHeight: '1.4' }} className="fade-in">
                    {step.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Spinning Animation Rule */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
