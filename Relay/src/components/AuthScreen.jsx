import React from 'react';
import './AuthScreen.css';
import GlowOrbs from './GlowOrb'; 

const AuthScreen = ({ title, subtitle, formInputs, toolbox, gridZone }) => {
  return (
    <div className="auth-container">
      <GlowOrbs />

      <div className="auth-content">
        
        {/* Left Side: Typography and Dynamic Inputs */}
        <div className="text-section">
          {/* These are now injected by App.js */}
          <h1>{title}</h1>
          <p>{subtitle}</p>
          
          <div className="form-inputs-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
            {formInputs}
          </div>

          <div className="toolbox-wrapper" style={{ marginTop: '2rem' }}>
             <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
               Craft your authentication key:
             </p>
             {toolbox}
          </div>
        </div>

        {/* Right Side: The Grid and Buttons */}
        <div className="grid-section">
           {gridZone}
        </div>

      </div>
    </div>
  );
};

export default AuthScreen;