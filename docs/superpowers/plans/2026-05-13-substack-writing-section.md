# Substack Writing Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Medium RSS tiles in the Writing section with Substack tiles and add a Substack subscribe embed below the article grid.

**Architecture:** Update `src/components/Writing.js` to fetch from `https://dashesnothyphens.substack.com/feed` via the existing `allorigins.win` CORS proxy. Adjust thumbnail extraction to read Substack's `<enclosure url="...">` tag (with a fallback to parsing `content:encoded` for `<img>` tags). Add a subscribe section below the article grid containing the provided iframe embed.

**Tech Stack:** React, RSS/XML parsing via DOMParser, localStorage caching

---

### Task 1: Swap the feed URL and cache key

**Files:**
- Modify: `src/components/Writing.js:257-262`

- [ ] **Step 1: Update the constants**

In `src/components/Writing.js`, replace lines 257–263:

```js
const MEDIUM_RSS_URL = "https://medium.com/feed/@santhoshs0305";
const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const MEDIUM_API_URL = `${CORS_PROXY}${encodeURIComponent(MEDIUM_RSS_URL)}`;

const CACHE_KEY = 'medium_articles_cache';
```

With:

```js
const SUBSTACK_RSS_URL = "https://dashesnothyphens.substack.com/feed";
const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const SUBSTACK_API_URL = `${CORS_PROXY}${encodeURIComponent(SUBSTACK_RSS_URL)}`;

const CACHE_KEY = 'substack_articles_cache';
```

- [ ] **Step 2: Update the fetch call to use the new constant**

On line 28, change:

```js
const response = await fetch(MEDIUM_API_URL, {
```

To:

```js
const response = await fetch(SUBSTACK_API_URL, {
```

- [ ] **Step 3: Update error log references**

On line 87, change:

```js
console.error('Error fetching Medium articles:', {
  error: err,
  url: MEDIUM_API_URL,
```

To:

```js
console.error('Error fetching Substack articles:', {
  error: err,
  url: SUBSTACK_API_URL,
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Writing.js
git commit -m "feat: switch Writing section feed URL from Medium to Substack"
```

---

### Task 2: Fix thumbnail extraction for Substack

**Files:**
- Modify: `src/components/Writing.js:53-61`

Substack delivers the cover image as `<enclosure url="https://..." length="..." type="image/..."/>` on each `<item>`, rather than embedding an `<img>` inside `content:encoded`.

- [ ] **Step 1: Replace the thumbnail extraction block**

In `src/components/Writing.js`, replace the thumbnail extraction inside `formattedArticles` (lines 53–61):

```js
// Extract first image from content
const content = item.querySelector('content\\:encoded, encoded')?.textContent || '';
let thumbnail = '';
const div = document.createElement('div');
div.innerHTML = content;
const firstImage = div.querySelector('img');
if (firstImage) {
  thumbnail = firstImage.src;
}
```

With:

```js
// Prefer Substack's enclosure tag, fall back to first img in content:encoded
const content = item.querySelector('content\\:encoded, encoded')?.textContent || '';
let thumbnail = item.querySelector('enclosure')?.getAttribute('url') || '';
if (!thumbnail) {
  const div = document.createElement('div');
  div.innerHTML = content;
  const firstImage = div.querySelector('img');
  if (firstImage) thumbnail = firstImage.src;
}
```

- [ ] **Step 2: Verify in browser**

Run `npm start` and open the Writing section. Each tile that has a Substack cover image should display it. Open DevTools → Network, confirm a request goes to `allorigins.win/raw?url=https%3A%2F%2Fdashesnothyphens.substack.com%2Ffeed` and returns 200.

- [ ] **Step 3: Commit**

```bash
git add src/components/Writing.js
git commit -m "feat: extract thumbnails from Substack enclosure tag"
```

---

### Task 3: Add Substack subscribe embed below the article grid

**Files:**
- Modify: `src/components/Writing.js:193-254` (the main return JSX)
- Modify: `src/App.css` (add embed container styles if not already present)

- [ ] **Step 1: Add the subscribe section in JSX**

In `src/components/Writing.js`, inside the outer `<div className="writing-container">`, add the subscribe section directly after the closing `</>` of the pagination block (after line 250, before the closing `</div>` on line 253):

```jsx
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
```

Place it so the full `return` block ends like:

```jsx
      {/* ... loading / error / articles blocks ... */}

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
    </div>  {/* writing-container */}
  </section>
);
```

- [ ] **Step 2: Check for existing embed styles**

The existing `.writing-embed-container` class is defined in `src/App.css` around line 974. Check whether it can be reused or whether a new `.writing-subscribe` class is needed:

```bash
grep -n "writing-embed-container\|writing-subscribe" src/App.css
```

- [ ] **Step 3: Add `.writing-subscribe` styles to App.css**

If `.writing-subscribe` is not already present, add after the `.writing-embed-container` block (around line 987):

```css
.writing-subscribe {
  margin-top: 3rem;
  text-align: center;
  padding: 2rem 1rem;
}

.writing-subscribe h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.writing-subscribe p {
  margin-bottom: 1.25rem;
  color: var(--text-secondary, #666);
  font-size: 0.95rem;
}

.writing-subscribe iframe {
  max-width: 100%;
}
```

- [ ] **Step 4: Verify in browser**

The subscribe embed should appear below the article grid (and below pagination). Resize to mobile — the iframe should not overflow horizontally due to `max-width: 100%`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Writing.js src/App.css
git commit -m "feat: add Substack subscribe embed below article grid"
```
