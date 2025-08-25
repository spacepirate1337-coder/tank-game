import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

console.log('main.tsx loading');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React app rendered');
} else {
  console.error('Root element not found');
}