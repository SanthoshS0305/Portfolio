import React from 'react';

const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Santhosh Senthil. All rights reserved.</p>
      <p className="footer-legal-links">
        <a href="/privacy.html">Privacy Policy</a>
        <span aria-hidden="true"> · </span>
        <a href="/cookies.html">Cookie Policy</a>
      </p>
    </footer>
  );
};

export default Footer;
