import React, { useState, useEffect, useMemo } from 'react';
import { readClient, queries } from '../cms/sanityClient';
import projectFallback from '../data/projects.json';

const formatDate = (iso) => {
  if (!iso) return null;
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

const selectStyle = {
  padding: '8px 12px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(247,247,247,0.2)',
  color: '#F7F7F7',
  borderRadius: '6px',
  fontSize: '13px',
  cursor: 'pointer',
};

const ProjectTiles = ({ onProjectClick }) => {
  const [allProjects, setAllProjects] = useState(projectFallback.projects);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTech, setFilterTech] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  const techOptions = useMemo(() => {
    const all = allProjects.flatMap((p) => p.techStack || []);
    return ['all', ...Array.from(new Set(all)).sort()];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    let result = [...allProjects];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(term) ||
        (p.shortDescription || '').toLowerCase().includes(term) ||
        (p.techStack || []).some((t) => t.toLowerCase().includes(term)) ||
        (p.features || []).some((f) => (f.label || '').toLowerCase().includes(term))
      );
    }
    if (filterTech !== 'all') {
      result = result.filter((p) => (p.techStack || []).includes(filterTech));
    }
    result.sort((a, b) => {
      if (sortOrder === 'default') return (a.order ?? 999) - (b.order ?? 999);
      if (sortOrder === 'lastcommit') {
        if (!a.githubPushedAt && !b.githubPushedAt) return 0;
        if (!a.githubPushedAt) return 1;
        if (!b.githubPushedAt) return -1;
        return b.githubPushedAt.localeCompare(a.githubPushedAt);
      }
      if (sortOrder === 'projectstart') {
        if (!a.githubCreatedAt && !b.githubCreatedAt) return 0;
        if (!a.githubCreatedAt) return 1;
        if (!b.githubCreatedAt) return -1;
        return b.githubCreatedAt.localeCompare(a.githubCreatedAt);
      }
      if (sortOrder === 'az') return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      if (sortOrder === 'za') return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
      return 0;
    });
    return result;
  }, [allProjects, searchTerm, filterTech, sortOrder]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterTech, sortOrder]);

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
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
  }, [itemsPerPage, filteredProjects.length, currentPage]);

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

      <div className="projects-controls">
        <input
          type="text"
          aria-label="Search projects"
          placeholder="Search…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...selectStyle, minWidth: '160px', cursor: 'text' }}
        />
        <select
          aria-label="Filter by tech"
          style={selectStyle}
          value={filterTech}
          onChange={(e) => setFilterTech(e.target.value)}
        >
          {techOptions.map((t) => (
            <option key={t} value={t}>{t === 'all' ? 'All Tech' : t}</option>
          ))}
        </select>
        <select
          aria-label="Sort order"
          style={selectStyle}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Default Order</option>
          <option value="lastcommit">Last Commit</option>
          <option value="projectstart">Project Start</option>
          <option value="az">A–Z</option>
          <option value="za">Z–A</option>
        </select>
      </div>

      <div className="projects-stats">
        {filteredProjects.length === 0 ? (
          <p>No projects match your filters ({allProjects.length} total)</p>
        ) : (
          <p>
            Showing {startIndex + 1}–{Math.min(endIndex, filteredProjects.length)} of{' '}
            {filteredProjects.length !== allProjects.length
              ? `${filteredProjects.length} matching projects (${allProjects.length} total)`
              : `${allProjects.length} projects`}
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        )}
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
            {(project.githubCreatedAt || project.githubPushedAt) && (
              <div className="project-meta">
                {project.githubCreatedAt && <span>Started {formatDate(project.githubCreatedAt)}</span>}
                {project.githubPushedAt && <span>Last commit {formatDate(project.githubPushedAt)}</span>}
              </div>
            )}
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
