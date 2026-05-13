import React, { useState, useEffect } from 'react';
import { readClient, queries } from '../cms/sanityClient';
import projectFallback from '../data/projects.json';

const ProjectTiles = ({ onProjectClick }) => {
  const [allProjects, setAllProjects] = useState(projectFallback.projects);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    readClient.fetch(queries.projects)
      .then((res) => { if (res?.length) setAllProjects(res); })
      .catch(() => {});
  }, []);

  const handleMouseMove = (e, tileElement) => {
    const rect = tileElement.getBoundingClientRect();
    tileElement.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    tileElement.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const itemsPerPage = window.innerWidth <= 768 ? 3 : 6;
  const totalPages = Math.ceil(allProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = allProjects.slice(startIndex, endIndex);

  useEffect(() => {
    const newTotalPages = Math.ceil(allProjects.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
  }, [itemsPerPage, allProjects.length, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="projects">
      <div className="projects-header">
        <h1>Projects</h1>
        <p>Here are some of the cool projects that I've worked on!</p>
      </div>

      <div className="projects-stats">
        <p>
          Showing {startIndex + 1}–{Math.min(endIndex, allProjects.length)} of {allProjects.length} projects
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </p>
      </div>

      <div className="project-tiles">
        {currentProjects.map((project) => (
          <div
            key={project._id || project.id}
            className="project-tile"
            onClick={() => onProjectClick(project)}
            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          >
            <h3>{project.title}</h3>
            <p>{project.shortDescription}</p>
            <div className="tech-stack">
              {(project.techStack || []).map((tech, index) => (
                <span key={index}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default ProjectTiles;
