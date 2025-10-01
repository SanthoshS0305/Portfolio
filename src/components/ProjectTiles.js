import React from 'react';
import projectData from '../data/projects.json';

const ProjectTiles = ({ onProjectClick }) => {
  const projects = projectData.projects;

  return (
    <div className="right-panel">
      <h2 className="project-list-header">Projects</h2>
      <div className="project-tiles">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="project-tile" 
            onClick={() => onProjectClick(project.id)}
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
