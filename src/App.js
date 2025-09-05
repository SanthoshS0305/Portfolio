import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import './App.css';

function App() {
  const [expandedProject, setExpandedProject] = useState(null);
  const [currentSection, setCurrentSection] = useState('hero');

  // Initialize Google Analytics
  useEffect(() => {
    // Replace 'G-XXXXXXXXXX' with your actual Google Analytics measurement ID
    ReactGA.initialize('G-66EPWTT7Q7');
    
    // Track initial page view
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  // Track page views when section changes
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: `/${currentSection}` });
  }, [currentSection]);

  // Track project views
  useEffect(() => {
    if (expandedProject !== null) {
      ReactGA.event({
        category: 'Project',
        action: 'View',
        label: `Project ${expandedProject + 1}`
      });
    }
  }, [expandedProject]);

  const handleProjectClick = (index) => {
    setExpandedProject(index);
    setCurrentSection('project');
    // Scroll left panel to top
    const leftPanel = document.querySelector('.left-panel');
    if (leftPanel) {
      leftPanel.scrollTop = 0;
    }
  };

  const handleClose = (e) => {
    // Only close if clicking outside the project content
    if (e.target.className === 'project-detail') {
      setExpandedProject(null);
      setCurrentSection('hero');
    }
  };

  const handleNavClick = (section) => {
    setCurrentSection(section);
    if (section !== 'project') {
      setExpandedProject(null);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <nav>
          <div className="profile-header">
            <img src="/profile.jpg" alt="Santhosh Senthil" className="profile-image" />
            <h1>Santhosh Senthil</h1>
          </div>
          <ul>
            <li><a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}>Home and Projects</a></li>
            <li><a href="/about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>Skills and Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="left-panel">
            {currentSection === 'hero' && (
              <section className="hero">
                <div className="hero-header">
                  <h1>Hi, I'm <span className="highlight">Santhosh Senthil</span></h1>
                  <p>Computer Science Student Specializing in Data Science and Machine Learning</p>
                </div>
                <div className="hero-content">
                  <div className="hero-image">
                    <img src="/profile.jpg" alt="Santhosh Senthil" className="hero-profile-image" />
                  </div>
                  <div className="hero-about">
                    <p>A passionate Computer Science Student double-majoring in Applied Math and Statistics and Minoring in Writing and Rhetoric at Stony Brook University in New York.</p>
                    <br />
                    <p>I am passionate about computers and people. That is why I am Vice President of the Game Development and Design Club at Stony Brook University and the Public Relations Officer of the Stony Brook Computing Society.</p>
                  </div>
                </div>
              </section>
            )}

            {currentSection === 'project' && expandedProject !== null && (
              <section className="project-detail" onClick={handleClose}>
                <div className="project-detail-content">
                  {expandedProject === 0 && (
                    <div className="expanded-content">
                      <h3>Discord Scam Detection Bot</h3>
                      <p>An intelligent Discord bot that automatically detects and filters spam messages using regex patterns, fuzzy string matching, and semantic similarity analysis.</p>
                      <div className="project-details">
                        <div className="project-text">
                          <ul>
                            <li><span className="highlight">Discord API:</span> Used the Discord API to create a bot that can detect and filter spam messages</li>
                            <li><span className="highlight">AWS EC2 Hosting:</span> Hosted the bot on an AWS EC2 instance using GitHub</li>
                            <li><span className="highlight">Multi-layered spam detection:</span> Pattern matching (regex), Fuzzy string comparison, Semantic similarity (SentenceTransformer)</li>
                            <li><span className="highlight">Adaptive learning system:</span> Persistent dataset storage, Dynamic threshold calculation, Pattern recognition from deleted messages</li>
                            <li><span className="highlight">Server-specific configuration:</span> JSON-based persistence, Environment variable secrets, Configurable admin channels</li>
                            <li><span className="highlight">Administrative controls:</span> Permission-gated operations, Approval workflow system, Comprehensive logging</li>
                            <li><span className="highlight">Modular architecture:</span> Separated concerns (filtering, config, admin), Independent component scaling, Extensible detection methods</li>
                            <li><span className="highlight">User-based weighting:</span> Join time consideration, Configurable time thresholds, Weighted scoring system</li>
                          </ul>
                        </div>
                        <div className="project-image">
                          <img src="/assets/discord_bot.png" alt="Discord Bot Screenshot" />
                        </div>
                      </div>
                      <div className="project-links">
                        <a href="https://github.com/SanthoshS0305/Discord-Scam-Detection-Bot" target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                          GitHub
                        </a>
                        <a href="https://discord.com/oauth2/authorize?client_id=1370882321238196345&permissions=2147559424&integration_type=0&scope=bot+applications.commands" target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                          Live Demo
                        </a>
                      </div>
                    </div>
                  )}
                  {expandedProject === 1 && (
                    <div className="expanded-content">
                      <h3>And Then I Woke Up Game</h3>
                      <p>A game exploring the five stages of grief that won the GDDC Game Jam 2025. Uses GDScript, showcasing game development skills and creative problem-solving.</p>
                      <div className="project-details">
                        <div className="project-text">
                          <ul>
                            <li>Built in <span className="highlight">Godot</span> using node-based architecture</li>
                            <li>Core entities (player, enemies, projectiles) implemented as <span className="highlight">CharacterBody2D nodes</span></li>
                            <li><span className="highlight">Global singleton</span> manages game state and level progression</li>
                            <li>Enemy AI uses <span className="highlight">behavior trees</span> with inheritance for different types</li>
                            <li>Combat system implements <span className="highlight">pool pattern</span> for projectile management</li>
                            <li>Scene-based structure with dedicated level management nodes</li>
                            <li><span className="highlight">Signal-based interaction</span> and dialogue systems</li>
                            <li><span className="highlight">State machine pattern</span> for gameplay state transitions</li>
                            <li><span className="highlight">Modular design</span> with clear separation of concerns</li>
                          </ul>
                        </div>
                        <div className="project-image">
                          <img src="/assets/And_then_I_woke_up.png" alt="Game Screenshot" />
                        </div>
                      </div>
                      <div className="project-links">
                        <a href="https://github.com/SanthoshS0305/GDDC-Game-Jam-25" target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                          GitHub
                        </a>
                        <a href="https://bellatorrex.itch.io/and-then-i-woke-up" target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                            <path d="M8 7h.01"></path>
                            <path d="M12 7h.01"></path>
                            <path d="M16 7h.01"></path>
                            <path d="M8 11h.01"></path>
                            <path d="M12 11h.01"></path>
                            <path d="M16 11h.01"></path>
                            <path d="M8 15h.01"></path>
                            <path d="M12 15h.01"></path>
                            <path d="M16 15h.01"></path>
                          </svg>
                          itch.io
                        </a>
                      </div>
                    </div>
                  )}
                  {expandedProject === 2 && (
                    <div className="expanded-content">
                      <h3>JavaScript Drum Kit</h3>
                      <p>Created an interactive virtual drum kit with preloaded sounds and easy sound swapping functionality.</p>
                      <div className="project-details">
                        <div className="project-text">
                          <ul>
                            <li>Implemented <span className="highlight">Web Audio API</span> for real-time sound processing and playback</li>
                            <li>Created <span className="highlight">event-driven architecture</span> for keyboard and mouse interactions</li>
                            <li>Built <span className="highlight">custom audio manager</span> for sound library and playback control</li>
                            <li>Utilized <span className="highlight">AudioContext</span> for precise timing and sound manipulation</li>
                            <li>Implemented <span className="highlight">responsive design</span> with CSS Grid</li>
                            <li>Added <span className="highlight">visual feedback system</span> for user interactions</li>
                            <li>Created <span className="highlight">modular component structure</span> for easy maintenance</li>
                            <li>Implemented <span className="highlight">keyboard event listeners</span> for drum triggers</li>
                            <li>Added <span className="highlight">sound preloading</span> for seamless playback</li>
                          </ul>
                        </div>
                        <div className="project-image">
                          <img src="/assets/drum_kit.png" alt="Drum Kit Screenshot" />
                        </div>
                      </div>
                      <div className="project-links">
                        <a href="https://github.com/SanthoshS0305/Javascript-Drum-Kit" target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                          GitHub
                        </a>
                        <a href="https://web-drummer.netlify.app" target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                          Live Demo
                        </a>
                      </div>
                    </div>
                  )}
                  {expandedProject === 3 && (
                    <div className="expanded-content">
                      <h3>Broomstick Chase Game</h3>
                      <p>Unity minigame scripted in C# where players chase a flying golden ball on a broomstick while dodging obstacles and opponents.</p>
                      <div className="project-details">
                        <div className="project-text">
                          <ul>
                            <li>Key Interactions:
                              <ul>
                                <li>Player collides with Bludgers/Chasers → knockback and score reset</li>
                                <li>Player reaches End Trigger/Snitch → win condition</li>
                                <li>Spawners instantiate obstacles at random vertical positions</li>
                              </ul>
                            </li>
                            <li>Game Flow:
                              <ul>
                                <li>Player avoids obstacles while moving toward End Trigger/Snitch</li>
                                <li>Game ends on win (reaching End Trigger) or loss (knockback too far)</li>
                              </ul>
                            </li>
                            <li>Technical Implementation:
                              <ul>
                                <li>Unity physics for collision detection and movement</li>
                                <li>Random number generation for obstacle spawning and movement offsets</li>
                                <li>Scene management for game restart</li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                        <div className="project-image">
                          <img src="/assets/broom.png" alt="Broomstick Game Screenshot" />
                        </div>
                      </div>
                      <div className="project-links">
                        <a href="https://github.com/SanthoshS0305/Broomstick-Chase-Game" target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                          GitHub
                        </a>
                      </div>
                    </div>
                  )}
                  {expandedProject === 4 && (
                    <div className="expanded-content">
                      <h3>GDDC Example Game</h3>
                      <p>A 2D platformer game created for the Game Development and Design Club to demonstrate various game development concepts and techniques.</p>
                      <div className="project-details">
                        <div className="project-text">
                          <ul>
                            <li><span className="highlight">Educational Purpose:</span> Designed as a learning resource for club members</li>
                            <li><span className="highlight">Game Development Concepts:</span> Demonstrates core game development principles</li>
                            <li><span className="highlight">GDScript Implementation:</span> Built using Godot's scripting language GDScript</li>
                            <li><span className="highlight">Modular Design:</span> Showcases clean code organization and structure</li>
                            <li><span className="highlight">Interactive Elements:</span> Includes various gameplay mechanics and interactions</li>
                            <li><span className="highlight">Documentation:</span> Well-commented code for educational purposes</li>
                          </ul>
                        </div>
                        <div className="project-image">
                          <img src="/assets/wolfiemenu.png" alt="GDDC Example Game Screenshot" />
                        </div>
                      </div>
                      <div className="project-links">
                        <a href="https://github.com/Brian0706/GDDC_Example_Game" target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                          GitHub
                        </a>
                        <a href="https://bellatorrex.itch.io/gddc-example-game" target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                            <path d="M8 7h.01"></path>
                            <path d="M12 7h.01"></path>
                            <path d="M16 7h.01"></path>
                            <path d="M8 11h.01"></path>
                            <path d="M12 11h.01"></path>
                            <path d="M16 11h.01"></path>
                            <path d="M8 15h.01"></path>
                            <path d="M12 15h.01"></path>
                            <path d="M16 15h.01"></path>
                          </svg>
                          itch.io
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {currentSection === 'about' && (
              <section className="about">
                <div className="about-header">
                  <h1>Skills and Contact</h1>
                </div>
                <div className="about-content">
                  <div className="skills-section">
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
                          <li>Machine Learning (Spacy)</li>
                          <li>NLP (Sentence Transformers)</li>
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
                  </div>
                  <div className="contact-section">
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
                  </div>
                </div>
              </section>
            )}
          </div>

          {currentSection !== 'about' && (
            <div className="right-panel">
              <h2 className="project-list-header">Projects</h2>
              <div className="project-tiles">
                <div className="project-tile" onClick={() => handleProjectClick(0)}>
                  <h3>Discord Scam Detection Bot</h3>
                  <p>An intelligent Discord bot that automatically detects and filters spam messages.</p>
                  <div className="tech-stack">
                    <span>Python</span>
                    <span>NLP</span>
                    <span>Machine Learning</span>
                  </div>
                </div>
                <div className="project-tile" onClick={() => handleProjectClick(1)}>
                  <h3>And Then I Woke Up Game</h3>
                  <p>A game exploring the five stages of grief that won the GDDC Game Jam 2025.</p>
                  <div className="tech-stack">
                    <span>GDScript</span>
                    <span>Game Development</span>
                  </div>
                </div>
                <div className="project-tile" onClick={() => handleProjectClick(2)}>
                  <h3>JavaScript Drum Kit</h3>
                  <p>Created an interactive virtual drum kit with preloaded sounds.</p>
                  <div className="tech-stack">
                    <span>JavaScript</span>
                    <span>Web Audio API</span>
                  </div>
                </div>
                <div className="project-tile" onClick={() => handleProjectClick(3)}>
                  <h3>Broomstick Chase Game</h3>
                  <p>Unity minigame scripted in C# where players chase a flying golden ball.</p>
                  <div className="tech-stack">
                    <span>Unity</span>
                    <span>C#</span>
                    <span>Game Development</span>
                  </div>
                </div>
                <div className="project-tile" onClick={() => handleProjectClick(4)}>
                  <h3>GDDC example game</h3>
                  <p>An example game project for the Game Development and Design Club.</p>
                  <div className="tech-stack">
                    <span>Game Development</span>
                    <span>GDScript</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer>
        <p>&copy; 2025 Santhosh Senthil. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
