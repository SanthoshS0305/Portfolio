import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Content from './components/Content';
import ProjectTiles from './components/ProjectTiles';
import ProjectModal from './components/ProjectModal';
import Footer from './components/Footer';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  // Initialize Google Analytics
  useEffect(() => {
    // Replace 'G-XXXXXXXXXX' with your actual Google Analytics measurement ID
    ReactGA.initialize('G-66EPWTT7Q7');
    
    // Track initial page view
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (selectedProject !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const handleProjectClick = (projectId) => {
    setSelectedProject(projectId);
    // Track project view
    ReactGA.event({
      category: 'Project',
      action: 'View',
      label: `Project ${projectId}`
    });
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className="App">
      <Header />

      <main className="main-content">
        {/* Hero Section */}
        <section id="home" className="page-section">
          <Hero />
        </section>

        {/* Projects Section */}
        <section id="projects" className="page-section">
          <ProjectTiles onProjectClick={handleProjectClick} />
        </section>

        {/* Content Section */}
        <section id="content" className="page-section">
          <Content />
        </section>

        {/* About Section */}
        <section id="about" className="page-section">
          <About />
        </section>
      </main>

      {/* Project Modal */}
      {selectedProject !== null && (
        <ProjectModal 
          projectId={selectedProject} 
          onClose={handleCloseModal} 
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
