import React from 'react';
import './App.css';
import profileImage from './assets/profile.jpg';

function App() {
  return (
    <div className="App">
      <header className="header">
        <nav>
          <div className="profile-header">
            <img src={profileImage} alt="Santhosh Senthil" className="profile-image" />
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
              <img src={profileImage} alt="Santhosh Senthil" className="hero-profile-image" />
            </div>
          </div>
        </section>

        <section id="projects" className="projects">
          <h2>Projects</h2>
          <div className="project-grid">
            <div className="project-card">
              <h3>Discord Scam Detection Bot</h3>
              <p>An intelligent Discord bot that automatically detects and filters spam messages using regex patterns, fuzzy string matching, and semantic similarity analysis.</p>
              <div className="tech-stack">
                <span>Python</span>
                <span>NLP</span>
                <span>Machine Learning</span>
              </div>
            </div>
            <div className="project-card">
              <h3>GDDC Game Jam 25</h3>
              <p>Developed a grief game for the Game Jam using GDScript, showcasing game development skills and creative problem-solving.</p>
              <div className="tech-stack">
                <span>GDScript</span>
                <span>Game Development</span>
              </div>
            </div>
            <div className="project-card">
              <h3>JavaScript Drum Kit</h3>
              <p>Created an interactive virtual drum kit with preloaded sounds and easy sound swapping functionality.</p>
              <div className="tech-stack">
                <span>JavaScript</span>
                <span>Web Audio API</span>
              </div>
            </div>
            <div className="project-card">
              <h3>Broomstick Chase Game</h3>
              <p>Developed a minigame where players chase a flying golden ball on a broomstick while dodging obstacles and opponents.</p>
              <div className="tech-stack">
                <span>ASP.NET</span>
                <span>Game Development</span>
              </div>
            </div>
            <div className="project-card">
              <h3>Job Applicant Table</h3>
              <p>Built a Java application for managing job applicant information with advanced sorting and filtering capabilities.</p>
              <div className="tech-stack">
                <span>Java</span>
                <span>Data Structures</span>
              </div>
            </div>
            <div className="project-card">
              <h3>Playfair Encryption Cipher</h3>
              <p>Implemented a Playfair encryption/decryption application that processes phrases and keys to generate encrypted strings.</p>
              <div className="tech-stack">
                <span>Java</span>
                <span>Cryptography</span>
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
                <li>GDScript</li>
                <li>ASP.NET</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Development</h3>
              <ul>
                <li>Game Development</li>
                <li>Web Development</li>
                <li>Machine Learning</li>
                <li>NLP</li>
                <li>Cryptography</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Tools & Technologies</h3>
              <ul>
                <li>Git</li>
                <li>Discord API</li>
                <li>Web Audio API</li>
                <li>Data Structures</li>
                <li>Algorithms</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <h2>Get in Touch</h2>
          <p>Feel free to reach out at <a href="mailto:santhosh.senthil@stonybrook.edu">santhosh.senthil@stonybrook.edu</a></p>
          <div className="social-links">
            <a href="https://github.com/SanthoshS0305" target="_blank" rel="noopener noreferrer">GitHub</a>
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
