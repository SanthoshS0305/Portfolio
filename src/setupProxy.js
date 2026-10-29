// Dev-only mirror of the /substack-feed rewrite in public/_redirects (Netlify handles it in production)
const https = require('https');

const SUBSTACK_RSS_URL = 'https://dashesnothyphens.substack.com/feed';

module.exports = (app) => {
  app.get('/substack-feed', (req, res) => {
    https
      .get(SUBSTACK_RSS_URL, (upstream) => {
        res.status(upstream.statusCode);
        res.set('Content-Type', upstream.headers['content-type'] || 'application/xml');
        upstream.pipe(res);
      })
      .on('error', (err) => res.status(502).send(err.message));
  });
};
