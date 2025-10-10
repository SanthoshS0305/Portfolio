import React, { useState, useEffect } from 'react';
import projectData from '../data/projects.json';

const ProjectTiles = ({ onProjectClick }) => {
  const handleMouseMove = (e, tileElement) => {
    const rect = tileElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    tileElement.style.setProperty('--mouse-x', `${x}px`);
    tileElement.style.setProperty('--mouse-y', `${y}px`);
  };
  const allProjects = projectData.projects;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = window.innerWidth <= 768 ? 3 : 6;

  // Pagination logic
  const totalPages = Math.ceil(allProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = allProjects.slice(startIndex, endIndex);

  // Update current page if it's out of bounds after a screen resize
  useEffect(() => {
    const newTotalPages = Math.ceil(allProjects.length / itemsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [itemsPerPage, allProjects.length, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of projects section
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>Projects</h2>
        <p>Here are some of my recent projects and work</p>
      </div>

      <div className="projects-stats">
        <p>
          Showing {startIndex + 1}-{Math.min(endIndex, allProjects.length)} of {allProjects.length} projects
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </p>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            Previous
          </button>
          
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="pagination-btn" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      )}

      <div className="project-tiles">
        {currentProjects.map((project) => (
          <div 
            key={project.id} 
            className="project-tile"
            onClick={() => onProjectClick(project.id)}
            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          >
            <h3>{project.title}</h3>
            <p>{project.shortDescription}</p>
            <div className="tech-stack">
              {project.techStack.map((tech, index) => (
                <span key={index}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTiles;
