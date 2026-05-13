import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

// Force dark mode on mount
document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1b2e',
            color: '#e2e8f0',
            border: '1px solid rgba(92, 124, 250, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#1a1b2e' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#1a1b2e' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
