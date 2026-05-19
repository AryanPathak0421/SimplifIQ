import React, { useState } from 'react';

const CHALLENGE_OPTIONS = [
  'Scale SEO Organic Search Traffic',
  'Increase Lead & Signup Conversion Rates',
  'Optimize Mobile Performance & Speed',
  'Elevate Brand Positioning & Copywriting',
  'Comprehensive Digital Presence Health Check'
];

export default function LeadForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    website: '',
    challenge: CHALLENGE_OPTIONS[0]
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please provide a valid business email address';
      }
    }

    if (!formData.website.trim()) {
      newErrors.website = 'Company website URL is required';
    } else {
      // Basic domain check
      const web = formData.website.trim().toLowerCase();
      if (!web.includes('.') || web.length < 4) {
        newErrors.website = 'Please provide a valid website domain';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleChipClick = (opt) => {
    setFormData(prev => ({ ...prev, challenge: opt }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="glass-card fade-in" style={{ maxWidth: '640px', margin: '40px auto 0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ 
          fontSize: '0.8rem', 
          color: 'hsl(var(--primary))', 
          fontWeight: 'bold', 
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Free Digital Diagnostic
        </span>
        <h2 style={{ fontSize: '2rem', marginTop: '6px', marginBottom: '12px' }}>
          Capture Deep Business Insights
        </h2>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem', lineHeight: '1.5' }}>
          Submit your company details. Our automated systems scrape your website, execute an AI advisory diagnostic, and compile a bespoke strategy report.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">FULL NAME</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              style={{ borderColor: errors.name ? 'hsl(var(--error))' : '' }}
            />
            {errors.name && <p style={{ color: 'hsl(var(--error))', fontSize: '0.75rem', marginTop: '6px' }}>{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">BUSINESS EMAIL</label>
            <input
              type="text"
              name="email"
              placeholder="e.g. john@yourcompany.com"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              style={{ borderColor: errors.email ? 'hsl(var(--error))' : '' }}
            />
            {errors.email && <p style={{ color: 'hsl(var(--error))', fontSize: '0.75rem', marginTop: '6px' }}>{errors.email}</p>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">COMPANY NAME</label>
            <input
              type="text"
              name="companyName"
              placeholder="e.g. Stripe (Optional)"
              className="form-input"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">WEBSITE DOMAIN / URL</label>
            <input
              type="text"
              name="website"
              placeholder="e.g. stripe.com"
              className="form-input"
              value={formData.website}
              onChange={handleChange}
              style={{ borderColor: errors.website ? 'hsl(var(--error))' : '' }}
            />
            {errors.website && <p style={{ color: 'hsl(var(--error))', fontSize: '0.75rem', marginTop: '6px' }}>{errors.website}</p>}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '32px' }}>
          <label className="form-label">WHAT IS YOUR PRIMARY BUSINESS GOAL?</label>
          <div className="chips-container">
            {CHALLENGE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`chip ${formData.challenge === opt ? 'active' : ''}`}
                onClick={() => handleChipClick(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>
          <span>Generate Free Audit & Report</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </form>
    </div>
  );
}
