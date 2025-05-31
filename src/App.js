import React, { useState } from 'react';
import './App.css';

function App() {
  const [expandedProject, setExpandedProject] = useState(null);

  const handleProjectClick = (index) => {
    setExpandedProject(index);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setExpandedProject(null);
    document.body.style.overflow = 'auto';
  };

  const projectImages = {
    0: "/assets/project_img_1.jpg",
    1: "/assets/project_img_2.jpg",
    2: "/assets/project_img_3.jpg",
    3: "/assets/project_img_4.jpg",
    4: "/assets/project_img_5.jpg",
    5: "/assets/project_img_6.jpg"
  };

  return (
    <div className="App">
      <div className={`overlay ${expandedProject !== null ? 'active' : ''}`} onClick={handleClose} />
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
          <h3>Click on the project to view more details</h3>
          <div className="project-grid">
            <div 
              className={`project-card ${expandedProject === 0 ? 'expanded' : ''}`}
              onClick={() => expandedProject === null && handleProjectClick(0)}
            >
              <button className="close-button" onClick={handleClose}>×</button>
              {expandedProject === 0 ? (
                <div className="expanded-content">
                  <h3>Discord Scam Detection Bot</h3>
                  <p>An intelligent Discord bot that automatically detects and filters spam messages using regex patterns, fuzzy string matching, and semantic similarity analysis.</p>
                  <div className="project-details">
                    <p>
                      This Discord bot leverages advanced natural language processing techniques to identify and filter out potential scam messages. 
                      The implementation includes custom regex patterns for spam detection and fuzzy string matching to catch similar messages. 
                      The bot's sophisticated analysis system helps maintain a safe environment by automatically identifying and removing malicious content.
                    </p>
                  </div>
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
              ) : (
                <>
                  <h3>Discord Scam Detection Bot</h3>
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
                </>
              )}
            </div>
            <div 
              className={`project-card ${expandedProject === 1 ? 'expanded' : ''}`}
              onClick={() => expandedProject === null && handleProjectClick(1)}
            >
              <button className="close-button" onClick={handleClose}>×</button>
              {expandedProject === 1 ? (
                <div className="expanded-content">
                  <h3>And Then I Woke Up Game</h3>
                  <p>Developed a grief game for the Game Jam using GDScript, showcasing game development skills and creative problem-solving.</p>
                  <div className="project-details">
                    <p>• Created immersive gameplay mechanics</p>
                    <p>• Implemented dynamic level design</p>
                    <p>• Developed custom game physics</p>
                  </div>
                  <div className="tech-stack">
                    <span>GDScript</span>
                    <span>Game Development</span>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/SanthoshS0305/GDDC-Game-Jam-25" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      GitHub
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <h3>And Then I Woke Up Game</h3>
                  <p>Developed a grief game for the Game Jam using GDScript, showcasing game development skills and creative problem-solving.</p>
                  <div className="tech-stack">
                    <span>GDScript</span>
                    <span>Game Development</span>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/SanthoshS0305/GDDC-Game-Jam-25" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      GitHub
                    </a>
                  </div>
                </>
              )}
            </div>
            <div 
              className={`project-card ${expandedProject === 2 ? 'expanded' : ''}`}
              onClick={() => expandedProject === null && handleProjectClick(2)}
            >
              <button className="close-button" onClick={handleClose}>×</button>
              {expandedProject === 2 ? (
                <div className="expanded-content">
                  <h3>JavaScript Drum Kit</h3>
                  <p>Created an interactive virtual drum kit with preloaded sounds and easy sound swapping functionality.</p>
                  <div className="project-details">
                    <p>• Implemented real-time audio processing</p>
                    <p>• Created responsive UI with keyboard controls</p>
                    <p>• Added custom sound library management</p>
                  </div>
                  <div className="tech-stack">
                    <span>JavaScript</span>
                    <span>Web Audio API</span>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/SanthoshS0305/Javascript-Drum-Kit" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      GitHub
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <h3>JavaScript Drum Kit</h3>
                  <p>Created an interactive virtual drum kit with preloaded sounds and easy sound swapping functionality.</p>
                  <div className="tech-stack">
                    <span>JavaScript</span>
                    <span>Web Audio API</span>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/SanthoshS0305/Javascript-Drum-Kit" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      GitHub
                    </a>
                  </div>
                </>
              )}
            </div>
            <div 
              className={`project-card ${expandedProject === 3 ? 'expanded' : ''}`}
              onClick={() => expandedProject === null && handleProjectClick(3)}
            >
              <button className="close-button" onClick={handleClose}>×</button>
              {expandedProject === 3 ? (
                <div className="expanded-content">
                  <h3>Broomstick Chase Game</h3>
                  <p>Developed a minigame where players chase a flying golden ball on a broomstick while dodging obstacles and opponents.</p>
                  <div className="project-details">
                    <p>• Created dynamic obstacle generation</p>
                    <p>• Implemented multiplayer functionality</p>
                    <p>• Developed custom physics for broomstick movement</p>
                  </div>
                  <div className="tech-stack">
                    <span>ASP.NET</span>
                    <span>Game Development</span>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/SanthoshS0305/Broomstick-Chase-Game" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      GitHub
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <h3>Broomstick Chase Game</h3>
                  <p>Developed a minigame where players chase a flying golden ball on a broomstick while dodging obstacles and opponents.</p>
                  <div className="tech-stack">
                    <span>ASP.NET</span>
                    <span>Game Development</span>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/SanthoshS0305/Broomstick-Chase-Game" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      GitHub
                    </a>
                  </div>
                </>
              )}
            </div>
            <div 
              className={`project-card ${expandedProject === 4 ? 'expanded' : ''}`}
              onClick={() => expandedProject === null && handleProjectClick(4)}
            >
              <button className="close-button" onClick={handleClose}>×</button>
              {expandedProject === 4 ? (
                <div className="expanded-content">
                  <h3>Playfair Encryption Cipher</h3>
                  <p>Implemented a Playfair encryption/decryption application that processes phrases and keys to generate encrypted strings.</p>
                  <div className="project-details">
                    <p>• Developed custom encryption algorithm</p>
                    <p>• Created user-friendly interface</p>
                    <p>• Implemented secure key management</p>
                  </div>
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
              ) : (
                <>
                  <h3>Playfair Encryption Cipher</h3>
                  <p>Implemented a Playfair encryption/decryption application that processes phrases and keys to generate encrypted strings.</p>
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
                </>
              )}
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
        <p>&copy; 2025 Santhosh Senthil. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
