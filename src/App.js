import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <nav>
          <div className="profile-header">
            <img src="/profile.jpg" alt="Santhosh Senthil" className="profile-image" />
            <h1>Santhosh Senthil</h1>
          </div>
          <ul>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="hero" className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Hi, I'm <span className="highlight">Santhosh Senthil</span></h1>
              <p>Computer Science Student Specializing in Data Science and Machine Learning</p>
            </div>
            <div className="hero-image">
              <img src="/profile.jpg" alt="Santhosh Senthil" className="hero-profile-image" />
            </div>
          </div>
        </section>

        <section id="projects" className="projects">
          <h2>Projects</h2>
          <div className="project-grid">
            <div className="project-card">
              <h3>
                <a href="https://github.com/SanthoshS0305/Discord-Scam-Detection-Bot" target="_blank" rel="noopener noreferrer">
                  Discord Scam Detection Bot
                </a>
              </h3>
              <p>An intelligent Discord bot that automatically detects and filters spam messages using regex patterns, fuzzy string matching, and semantic similarity analysis.</p>
              <div className="tech-stack">
                <span>Python</span>
                <span>NLP</span>
                <span>Machine Learning</span>
              </div>
              <div className="project-links">
                <a href="https://github.com/SanthoshS0305/Discord-Scam-Detection-Bot" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub
                </a>
              </div>
            </div>
            <div className="project-card">
              <h3>
                <a href="https://github.com/SanthoshS0305/GDDC-Game-Jam-25" target="_blank" rel="noopener noreferrer">
                  And Then I Woke Up Game
                </a>
              </h3>
              <p>A game on the stages of grief for the GDDC Game Jam using GDScript, showcasing game development skills and creative problem-solving.</p>
              <div className="tech-stack">
                <span>Godot Engine</span>
                <span>Game Development</span>
              </div>
              <div className="project-links">
                <a href="https://github.com/SanthoshS0305/GDDC-Game-Jam-25" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub
                </a>
              </div>
            </div>
            <div className="project-card">
              <h3>
                <a href="https://github.com/SanthoshS0305/Javascript-Drum-Kit" target="_blank" rel="noopener noreferrer">
                  JavaScript Drum Kit
                </a>
              </h3>
              <p>An interactive virtual drum kit with preloaded sounds and easy sound swapping functionality.</p>
              <div className="tech-stack">
                <span>JavaScript</span>
                <span>Web Audio API</span>
              </div>
              <div className="project-links">
                <a href="https://github.com/SanthoshS0305/Javascript-Drum-Kit" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub
                </a>
                <a href="https://web-drummer.netlify.app" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  Live Demo
                </a>
              </div>
            </div>
            <div className="project-card">
              <h3>
                <a href="https://github.com/SanthoshS0305/Broomstick-Chase-Game" target="_blank" rel="noopener noreferrer">
                  Broomstick Chase Game
                </a>
              </h3>
              <p>A minigame where players chase a flying golden ball on a broomstick while dodging obstacles and opponents.</p>
              <div className="tech-stack">
                <span>Unity Engine</span>
                <span>Game Development</span>
              </div>
              <div className="project-links">
                <a href="https://github.com/SanthoshS0305/Broomstick-Chase-Game" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub
                </a>
              </div>
            </div>
            <div className="project-card">
              <h3>
                <a href="https://github.com/SanthoshS0305/Playfair-Encryption-Cipher" target="_blank" rel="noopener noreferrer">
                  Playfair Encryption Cipher
                </a>
              </h3>
              <p>A Playfair encryption/decryption application that processes phrases and keys to generate encrypted strings.</p>
              <div className="tech-stack">
                <span>Java</span>
                <span>Cryptography</span>
              </div>
              <div className="project-links">
                <a href="https://github.com/SanthoshS0305/Playfair-Encryption-Cipher" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="skills">
          <h2>Skills</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Programming Languages</h3>
              <ul>
                <li>Java</li>
                <li>Python</li>
                <li>JavaScript</li>
                <li>React JS</li>
                <li>C</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Development</h3>
              <ul>
                <li>Game Development</li>
                <li>Web Development</li>
                <li>Machine Learning</li>
                <li>NLP (Spacy)</li>
                <li>Full Stack Development</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Tools & Technologies</h3>
              <ul>
                <li>Git and GitHub</li>
                <li>Discord API</li>
                <li>Web Audio API</li>
                <li>Unity and Godot Engine</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <h2>Get in Touch</h2>
          <p>Feel free to reach out at <a href="mailto:santhoshs0305@gmail.com">santhoshs0305@gmail.com</a></p>
          <div className="social-links">
            <a href="https://github.com/SanthoshS0305" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/santhosh-senthil-589164249/" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Santhosh Senthil. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
