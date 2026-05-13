import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Dynamically import so App.css (which has global body::before blur)
// is never loaded when visiting /admin
if (window.location.pathname === '/admin') {
  import('./cms/CMSAuthGate').then(({ default: CMSAuthGate }) => {
    root.render(
      <React.StrictMode>
        <CMSAuthGate />
      </React.StrictMode>
    );
  });
} else {
  import('./App').then(({ default: App }) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
}
