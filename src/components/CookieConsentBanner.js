import React, { useState } from 'react';
import { getConsent, grantConsent, denyConsent } from '../utils/consent';

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(() => !getConsent());

  if (!visible) return null;

  const handleAccept = () => {
    grantConsent();
    setVisible(false);
  };

  const handleDecline = () => {
    denyConsent();
    setVisible(false);
  };

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <p className="cookie-banner-text">
        This site uses optional analytics cookies (Google Analytics) to understand how visitors use it.
        Read the <a href="/privacy.html">Privacy Policy</a> and <a href="/cookies.html">Cookie Policy</a> to learn more.
      </p>
      <div className="cookie-banner-actions">
        <button type="button" className="cookie-banner-decline" onClick={handleDecline}>
          Decline
        </button>
        <button type="button" className="cookie-banner-accept" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
