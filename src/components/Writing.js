import React, { useState, useEffect } from 'react';

const Writing = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = window.innerWidth <= 768 ? 2 : 6;

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

        const response = await fetch(MEDIUM_API_URL, {
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Validate feed structure
        const channelTitle = xmlDoc.querySelector('channel > title')?.textContent;
        if (!channelTitle) {
          throw new Error('Invalid feed: missing channel title');
        }

        const items = xmlDoc.querySelectorAll('item');
        if (!items || items.length === 0) {
          throw new Error('Invalid feed format or no items found');
        }

        const formattedArticles = Array.from(items).map(item => {
          // Extract first image from content
          const content = item.querySelector('content\\:encoded, encoded')?.textContent || '';
          let thumbnail = '';
          const div = document.createElement('div');
          div.innerHTML = content;
          const firstImage = div.querySelector('img');
          if (firstImage) {
            thumbnail = firstImage.src;
          }

          const description = item.querySelector('description')?.textContent || '';
          const title = item.querySelector('title')?.textContent || '';
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';

          return {
            title,
            description: formatDescription(description || content || ''),
            link,
            thumbnail,
            date: new Date(pubDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            readTime: calculateReadTime(content || '')
          };
        });

        setArticles(formattedArticles);
        setCache(formattedArticles);
        
      } catch (err) {
        console.error('Error fetching Medium articles:', {
          error: err,
          url: MEDIUM_API_URL,
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
          } else if (err.message.includes('Invalid feed')) {
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
      const newItemsPerPage = window.innerWidth <= 768 ? 2 : 6;
      const newTotalPages = Math.ceil(articles.length / newItemsPerPage);
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
          <p>My thoughts and insights on technology, development, and more</p>
        </div>

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
            <div className="writing-stats">
              Showing {startIndex + 1}-{Math.min(endIndex, articles.length)} of {articles.length} articles (Page {currentPage} of {totalPages})
            </div>

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
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <div className="writing-stats">
                    <span>{article.date}</span>
                    <span>{article.readTime} min read</span>
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
    </section>
  );
};

const MEDIUM_RSS_URL = "https://medium.com/feed/@santhoshs0305";
const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const MEDIUM_API_URL = `${CORS_PROXY}${encodeURIComponent(MEDIUM_RSS_URL)}`;

const CACHE_KEY = 'medium_articles_cache';
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
  return text.length > 150 ? text.substring(0, 150) + "..." : text;
};

const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  return Math.ceil(words / wordsPerMinute);
};

export default Writing;
