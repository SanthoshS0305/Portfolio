import React, { useEffect, useMemo, useState } from 'react';
import contentData from '../data/content.json';
import instagramData from '../data/instagram.json';
import { readClient, queries } from '../cms/sanityClient';

const fromApify = (post, index) => ({
  id: `apify-${post.id || index}`,
  type: 'instagram',
  url: post.url,
  title: (post.caption || '').slice(0, 80) || 'Instagram Post',
  description: post.caption || '',
  dateAdded: post.timestamp?.slice(0, 10) || '',
  platform: 'Instagram',
  category: 'SBCS',
  tags: ['Stony Brook', 'Computer Science', 'SBCS'],
  likes: post.likesCount ?? null,
  comments: post.commentsCount ?? null,
  views: post.videoViewCount ?? null,
});

const fromSanity = (item) => ({
  id: item._id,
  type: item.type || 'instagram',
  url: item.url || '',
  title: item.title || '',
  description: item.description || '',
  dateAdded: item.dateAdded || '',
  platform: item.platform || 'Instagram',
  category: item.category || '',
  tags: item.tags || [],
  likes: item.likes ?? null,
  comments: item.comments ?? null,
  views: item.views ?? null,
});

const Content = () => {
  const handleMouseMove = (e, tileElement) => {
    const rect = tileElement.getBoundingClientRect();
    tileElement.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    tileElement.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  // Manual entries: start with local JSON fallback, update with Sanity data
  const [manualItems, setManualItems] = useState(contentData.content);
  const [hiddenContentUrls, setHiddenContentUrls] = useState([]);

  useEffect(() => {
    readClient.fetch(queries.contentItems)
      .then((res) => { if (res?.length) setManualItems(res.map(fromSanity)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    readClient.fetch(queries.siteSettings)
      .then((s) => { if (s?.hiddenContentUrls) setHiddenContentUrls(s.hiddenContentUrls); })
      .catch(() => {});
  }, []);

  const allContent = useMemo(() => {
    const manualUrls = new Set(manualItems.map((c) => c.url));
    const hiddenSet = new Set(hiddenContentUrls);
    const apifyItems = instagramData
      .filter((p) => p.url && !manualUrls.has(p.url) && !hiddenSet.has(p.url))
      .map(fromApify);
    const combined = [...apifyItems, ...manualItems];
    return combined.filter(
      (item) => item.type !== 'instagram' || !item.dateAdded || item.dateAdded >= '2025-01-01'
    );
  }, [manualItems, hiddenContentUrls]);

  const [filteredContent, setFilteredContent] = useState(allContent);
  const [sortBy, setSortBy] = useState('views');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    let filtered = [...allContent];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (filterPlatform !== 'all') filtered = filtered.filter((item) => item.platform === filterPlatform);
    if (filterCategory !== 'all') filtered = filtered.filter((item) => item.category === filterCategory);

    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'views') { aVal = a.views ?? -1; bVal = b.views ?? -1; }
      else if (sortBy === 'likes') { aVal = a.likes ?? -1; bVal = b.likes ?? -1; }
      else if (sortBy === 'date') { aVal = a.dateAdded || ''; bVal = b.dateAdded || ''; }
      else { aVal = a.title.toLowerCase(); bVal = b.title.toLowerCase(); }

      if (sortOrder === 'desc') return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });

    setFilteredContent(filtered);
    setCurrentPage(1);
  }, [allContent, searchTerm, filterPlatform, filterCategory, sortBy, sortOrder]);

  const platforms = ['all', ...new Set(allContent.map((c) => c.platform).filter(Boolean))];
  const categories = ['all', ...new Set(allContent.map((c) => c.category).filter(Boolean))];

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredContent.slice(startIndex, startIndex + itemsPerPage);

  const loadInstagramEmbed = () => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  const loadTikTokEmbed = () => {
    if (!document.querySelector('script[src*="tiktok.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    const hasInstagram = currentItems.some((i) => i.platform === 'Instagram');
    const hasTikTok = currentItems.some((i) => i.platform === 'TikTok');
    if (hasInstagram) loadInstagramEmbed();
    if (hasTikTok) loadTikTokEmbed();
  }, [currentItems]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectStyle = {
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(247,247,247,0.2)',
    color: '#F7F7F7',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  };

  return (
    <section className="content-section">
      <div className="content-header">
        <h1>Content</h1>
        <p>Check out some of the social media content I've created!</p>
      </div>

      <div className="content-controls">
        <input
          type="text"
          placeholder="Search…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...selectStyle, minWidth: '160px' }}
        />
        <select style={selectStyle} value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}>
          {platforms.map((p) => <option key={p} value={p}>{p === 'all' ? 'All Platforms' : p}</option>)}
        </select>
        <select style={selectStyle} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
        <select style={selectStyle} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="views">Most Viewed</option>
          <option value="likes">Most Liked</option>
          <option value="date">Date Added</option>
          <option value="title">Title</option>
        </select>
        <select style={selectStyle} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Newest / Highest First</option>
          <option value="asc">Oldest / Lowest First</option>
        </select>
      </div>

      <div className="content-grid">
        {currentItems.map((item) => (
          <div
            key={item.id || item.url}
            className="content-item"
            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          >
            <div className="content-item-header">
              <span className="content-platform">{item.platform}</span>
              {item.category && <span className="content-category">{item.category}</span>}
            </div>
            <h3 className="content-title">{item.title}</h3>
            {item.platform === 'Instagram' && item.url && (
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={item.url}
                data-instgrm-version="14"
                style={{ background: '#FFF', border: 0, borderRadius: '3px', boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', margin: '1px', maxWidth: '540px', minWidth: '326px', padding: 0, width: 'calc(100% - 2px)' }}
              />
            )}
            {item.platform === 'TikTok' && item.url && (
              <blockquote
                className="tiktok-embed"
                cite={item.url}
                data-video-id={item.url.split('/video/')[1]}
                style={{ maxWidth: '605px', minWidth: '325px' }}
              >
                <section />
              </blockquote>
            )}
            <div className="content-meta">
              {item.views != null && <span>👁 {item.views.toLocaleString()}</span>}
              {item.likes != null && <span>❤️ {item.likes.toLocaleString()}</span>}
              {item.comments != null && <span>💬 {item.comments.toLocaleString()}</span>}
            </div>
          </div>
        ))}
        {currentItems.length === 0 && (
          <p style={{ color: '#888', gridColumn: '1/-1', textAlign: 'center' }}>No results found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>Previous</button>
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} className={`pagination-page ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
            ))}
          </div>
          <button className="pagination-btn" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </section>
  );
};

export default Content;
