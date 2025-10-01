import React from 'react';

const Header = ({ onNavClick }) => {
  return (
    <header className="header">
      <nav>
        <div className="profile-header">
          <img src="/profile.jpg" alt="Santhosh Senthil" className="profile-image" />
          <h1>Santhosh Senthil</h1>
        </div>
        <ul>
          <li><a href="/" onClick={(e) => { e.preventDefault(); onNavClick('hero'); }}>Home and Projects</a></li>
          <li><a href="/about" onClick={(e) => { e.preventDefault(); onNavClick('about'); }}>Skills and Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
