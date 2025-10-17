import React from 'react';

const About = () => {
  const handleMouseMove = (e, element) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    element.style.setProperty('--mouse-x', `${x}px`);
    element.style.setProperty('--mouse-y', `${y}px`);
  };
  return (
    <section className="about">
      <div className="about-header">
        <h1>Skills and Contact</h1>
      </div>
      <div className="about-content">
        <div className="skills-section">
          <h2>Skills</h2>
          <div className="skills-grid">
            <div 
              className="skill-category"
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
            >
              <h3>Programming Languages</h3>
              <ul>
                <li>Java</li>
                <li>Python</li>
                <li>JavaScript</li>
                <li>React JS</li>
                <li>C</li>
              </ul>
            </div>
            <div 
              className="skill-category"
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
            >
              <h3>Development</h3>
              <ul>
                <li>Game Development</li>
                <li>Web Development</li>
                <li>Machine Learning (Spacy)</li>
                <li>NLP (Sentence Transformers)</li>
                <li>Full Stack Development</li>
              </ul>
            </div>
            <div 
              className="skill-category"
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
            >
              <h3>Tools & Technologies</h3>
              <ul>
                <li>Git and GitHub</li>
                <li>Discord API</li>
                <li>Web Audio API</li>
                <li>Unity and Godot Engine</li>
              </ul>
            </div>
          </div>
        </div>
        <div 
          className="contact-section"
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
        >
          <h2>My Other Platforms</h2>
          <p>Contact me via Email at <a href="mailto:santhoshs0305@gmail.com">santhoshs0305@gmail.com</a></p>
          <div className="social-links">
            <a href="https://github.com/SanthoshS0305" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/santhosh-senthil-589164249/" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              LinkedIn
            </a>
            <a href="https://www.instagram.com/s.senthil05/" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
