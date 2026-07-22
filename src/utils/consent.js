export const CONSENT_KEY = 'cookie_consent';
export const CONSENT_GRANTED_EVENT = 'cookie-consent-granted';

export const getConsent = () => localStorage.getItem(CONSENT_KEY);

export const grantConsent = () => {
  localStorage.setItem(CONSENT_KEY, 'granted');
  if (window.__loadAnalytics) window.__loadAnalytics();
  window.dispatchEvent(new Event(CONSENT_GRANTED_EVENT));
};

export const denyConsent = () => {
  localStorage.setItem(CONSENT_KEY, 'denied');
};
