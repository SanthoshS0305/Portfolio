import React, { useState, useEffect } from 'react';

const Writing = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchArticles = async (retryCount = 0, isBackgroundRefresh = false) => {
      try {
        if (!isBackgroundRefresh) {
          setLoading(true);
          setError(null);
        }

        // Check cache first
        const cachedData = getCache();
        if (cachedData && !isBackgroundRefresh) {
          setArticles(cachedData);
          setLoading(false);
          // Fetch fresh data in background
          fetchArticles(0, true);
          return;
        }

        const response = await fetch(SUBSTACK_API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 'ok') {
          throw new Error('Invalid feed: rss2json returned non-ok status');
        }

        if (!data.items || data.items.length === 0) {
          throw new Error('Invalid feed format or no items found');
        }

        const formattedArticles = data.items.map(item => ({
          title: item.title || '',
          description: formatDescription(item.description || item.content || ''),
          link: item.link || '',
          thumbnail: item.enclosure?.link || item.thumbnail || '',
          date: new Date(item.pubDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          readTime: calculateReadTime(item.content || '')
        }));

        setArticles(formattedArticles);
        setCache(formattedArticles);
        
      } catch (err) {
        console.error('Error fetching Substack articles:', {
          error: err,
          url: SUBSTACK_API_URL,
          retryCount,
          isBackgroundRefresh,
          message: err.message
        });

        // Only show error and retry if this isn't a background refresh
        if (!isBackgroundRefresh) {
          if (retryCount < MAX_RETRIES) {
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            await sleep(delay);
            return fetchArticles(retryCount + 1, false);
          }

          let errorMessage = 'Failed to load articles. ';
          
          if (err.message.includes('HTTP error')) {
            errorMessage += 'The server returned an error. ';
          } else if (err.message.includes('Failed to fetch')) {
            errorMessage += 'Network error - please check your connection. ';
          } else if (err.message.includes('Invalid feed') || err.message.includes('non-ok status')) {
            errorMessage += 'The feed format was invalid. ';
          }
          
          // Use cached data as fallback
          const cachedData = getCache();
          if (cachedData) {
            setArticles(cachedData);
            errorMessage += 'Showing cached data. ';
          }
          
          errorMessage += 'Please try again later.';
          setError(errorMessage);
        }
      } finally {
        if (!isBackgroundRefresh) {
          setLoading(false);
        }
      }
    };

    fetchArticles();
    // Fetch articles every hour
    const interval = setInterval(fetchArticles, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newTotalPages = Math.ceil(articles.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage, articles.length]);

  const handleMouseMove = (e, element) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    element.style.setProperty('--mouse-x', `${x}px`);
    element.style.setProperty('--mouse-y', `${y}px`);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    document.querySelector('.writing-container').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="page-section" id="writing">
      <div className="writing-container">
        <div className="writing-header">
          <h2>Writing</h2>
          <p>Writing is my one true love, and I'm so excited to share my work with you!</p>
        </div>

        <div className="writing-body">
          <div className="writing-posts">
            {loading ? (
              <div className="writing-skeleton">
                {[...Array(itemsPerPage)].map((_, index) => (
                  <div key={index} className="writing-skeleton-item">
                    <div className="skeleton-image" />
                    <div className="skeleton-title" />
                    <div className="skeleton-text" />
                    <div className="skeleton-text" />
                    <div className="skeleton-text" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="writing-error">{error}</div>
            ) : articles.length === 0 ? (
              <div className="writing-empty">No articles found.</div>
            ) : (
              <>
                <div className="writing-grid">
                  {currentArticles.map((article, index) => (
                    <div
                      key={index}
                      className="writing-item"
                      onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                      onClick={() => window.open(article.link, '_blank')}
                    >
                      {article.thumbnail && (
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="writing-thumbnail"
                        />
                      )}
                      <div className="writing-item-text">
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        <div className="writing-meta">
                          <span>{article.date}</span>
                          <span>{article.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="writing-pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
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
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="writing-subscribe">
            <h3>Subscribe</h3>
            <p>Get new essays delivered straight to your inbox.</p>
            <iframe
              src="https://dashesnothyphens.substack.com/embed?transparent=1&light=1"
              width="480"
              height="320"
              style={{ border: 0, background: 'transparent' }}
              frameBorder="0"
              scrolling="no"
              title="Subscribe to Dashes Not Hyphens"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const SUBSTACK_RSS_URL = "https://dashesnothyphens.substack.com/feed";
const SUBSTACK_API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBSTACK_RSS_URL)}`;

const CACHE_KEY = 'substack_articles_cache';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const MAX_RETRIES = 3;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getCache = () => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;
    
    const { timestamp, data } = JSON.parse(cache);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error reading cache:', err);
    return null;
  }
};

const setCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch (err) {
    console.error('Error setting cache:', err);
  }
};

const formatDescription = (description) => {
  const div = document.createElement('div');
  div.innerHTML = description;
  // Get first paragraph or first 150 characters
  const text = div.textContent || div.innerText || "";
  return text.length > 160 ? text.substring(0, 160) + "..." : text;
};

const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  return Math.ceil(words / wordsPerMinute);
};

export default Writing;
