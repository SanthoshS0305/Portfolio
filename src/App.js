import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Content from './components/Content';
import ProjectTiles from './components/ProjectTiles';
import Writing from './components/Writing';
import ProjectModal from './components/ProjectModal';
import Footer from './components/Footer';
import { readClient, queries } from './cms/sanityClient';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    ReactGA.initialize('G-66EPWTT7Q7');
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);

  // Fetch hero data once; shared with both Hero and Header
  useEffect(() => {
    readClient.fetch(queries.hero)
      .then((data) => { if (data) setHeroData(data); })
      .catch(() => {});
  }, []);

  // Update favicon when profile image changes
  useEffect(() => {
    if (heroData?.profileImageUrl) {
      const icon = document.querySelector("link[rel='icon']");
      if (icon) icon.href = heroData.profileImageUrl;
      const apple = document.querySelector("link[rel='apple-touch-icon']");
      if (apple) apple.href = heroData.profileImageUrl;
    }
  }, [heroData?.profileImageUrl]);

  useEffect(() => {
    if (selectedProject !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProject]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    ReactGA.event({ category: 'Project', action: 'View', label: `Project ${project.title || project.id}` });
  };

  const handleCloseModal = () => setSelectedProject(null);

  return (
    <div className="App">
      <Header heroData={heroData} />

      <main className="main-content">
        <section id="home" className="page-section">
          <Hero heroData={heroData} />
        </section>

        <section id="projects" className="page-section">
          <ProjectTiles onProjectClick={handleProjectClick} />
        </section>

        <section id="writing" className="page-section">
          <Writing />
        </section>

        <section id="content" className="page-section">
          <Content />
        </section>

        <section id="about" className="page-section">
          <About />
        </section>
      </main>

      {selectedProject !== null && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}

      <Footer />
    </div>
  );
}

export default App;
