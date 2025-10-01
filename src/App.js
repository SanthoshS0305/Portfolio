import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectDetail from './components/ProjectDetail';
import About from './components/About';
import Content from './components/Content';
import ProjectTiles from './components/ProjectTiles';
import Footer from './components/Footer';

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
      <Header onNavClick={handleNavClick} />

      <main className="main-content">
        <div className="content-wrapper">
          <div className="left-panel">
            {currentSection === 'hero' && <Hero />}
            {currentSection === 'project' && (
              <ProjectDetail 
                expandedProject={expandedProject} 
                onClose={handleClose} 
              />
            )}
            {currentSection === 'content' && <Content />}
            {currentSection === 'about' && <About />}
          </div>

          {currentSection !== 'about' && currentSection !== 'content' && (
            <ProjectTiles onProjectClick={handleProjectClick} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
