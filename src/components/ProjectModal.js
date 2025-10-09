import React, { useEffect } from 'react';
import projectData from '../data/projects.json';

const ProjectModal = ({ projectId, onClose }) => {
  const getIcon = (iconType) => {
    if (iconType === "github") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      );
    } else if (iconType === "external") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      );
    } else if (iconType === "itch") {
      return (
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
      );
    } else if (iconType === "demo") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5,3 19,12 5,21"></polygon>
        </svg>
      );
    }
    // Default fallback icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    );
  };

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  if (projectId === null || projectId === undefined) {
    return null;
  }

  // eslint-disable-next-line eqeqeq
  const project = projectData.projects.find(p => p.id == projectId); // Use loose equality to handle type mismatches
  
  if (!project) {
    console.error(`Project with ID ${projectId} not found`);
    return null;
  }

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{project.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">{project.description}</p>
          
          <div className="modal-details">
            <div className="modal-text">
              <ul>
                {project.features.map((feature, index) => (
                  <li key={index}>
                    {feature.label && <span className="highlight">{feature.label}</span>}
                    {feature.text && <span>{feature.text}</span>}
                    {feature.subItems && (
                      <ul>
                        {feature.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>{subItem}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="modal-image">
              <img src={project.image} alt={`${project.title} Screenshot`} />
            </div>
          </div>
          
          <div className="modal-links">
            {project.links.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                {getIcon(link.icon)}
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
