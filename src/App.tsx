import * as React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="header">
        <nav>
          <h1>Santhosh Senthil</h1>
          <ul>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="hero" className="hero">
          <h1>Hi, I'm <span className="highlight">Santhosh Senthil</span></h1>
          <p>Computer Science Student Specializing in Data Science and Machine Learning</p>
        </section>

        <section id="projects" className="projects">
          <h2>Projects</h2>
          <div className="project-grid">
            <div className="project-card">
              <h3>Discord Spam Detection Bot</h3>
              <p>Description of project 1</p>
              <div className="tech-stack">
                <span>React</span>
                <span>Node.js</span>
              </div>
            </div>
            <div className="project-card">
              <h3>Project 2</h3>
              <p>Description of project 2</p>
              <div className="tech-stack">
                <span>Python</span>
                <span>Django</span>
              </div>
            </div>
            <div className="project-card">
              <h3>Project 3</h3>
              <p>Description of project 3</p>
              <div className="tech-stack">
                <span>JavaScript</span>
                <span>Express</span>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="skills">
          <h2>Skills</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Frontend</h3>
              <ul>
                <li>React</li>
                <li>JavaScript</li>
                <li>HTML/CSS</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js</li>
                <li>Python</li>
                <li>SQL</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Tools</h3>
              <ul>
                <li>Git</li>
                <li>Docker</li>
                <li>AWS</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <h2>Get in Touch</h2>
          <p>Feel free to reach out at <a href="mailto:your.email@example.com">your.email@example.com</a></p>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Your Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App; 