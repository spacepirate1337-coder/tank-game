import React from 'react';

export const App: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: '#00ff00',
      fontFamily: 'Courier New, monospace',
      fontSize: '24px'
    }}>
      <div>
        <h1>SPECTRE WEB CLONE</h1>
        <p>Simple test - this should display!</p>
        <p>If you see this, React is working.</p>
      </div>
    </div>
  );
};