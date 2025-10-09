import React from 'react';

const Header = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className="header">
      <nav>
        <div className="profile-header">
          <img src="/profile.jpg" alt="Santhosh Senthil" className="profile-image" />
          <h1>Santhosh Senthil</h1>
        </div>
        <ul>
          <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
          <li><a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>Projects</a></li>
          <li><a href="#content" onClick={(e) => { e.preventDefault(); scrollToSection('content'); }}>Content</a></li>
          <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>Skills and Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
