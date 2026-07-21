# Certifications Vertical Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a vertical, auto-scrolling certifications carousel beside the hero section, give both carousels a CMS autoplay toggle and prev/next arrow buttons, via a shared marquee hook.

**Architecture:** Extract the existing horizontal carousel's animation/pause logic (in `src/components/Hero.js`) into a reusable `useMarqueeCarousel` hook parameterized by axis. Refactor the existing `HorizontalScroll` to use it, then build a new `VerticalScroll` on the same hook for certifications. Both read autoplay flags from the existing `siteSettings` Sanity singleton; both get arrow buttons that call the hook's `nudge()`.

**Tech Stack:** React (CRA/react-scripts), Sanity (`@sanity/client`), plain CSS (`src/App.css`), no test framework in use in this repo.

## Global Constraints

- No automated test suite exists in this repo (no `@testing-library`, no `.test.js` files) — every task's verification step is manual, via the dev server in a browser, or a direct Sanity API check. Do not introduce a test framework as part of this plan.
- Both new `siteSettings` booleans (`companyCarouselAutoplay`, `certCarouselAutoplay`) must default to `true` (autoplay on) wherever read, so existing behavior is unchanged until a value is explicitly set to `false`.
- Follow existing code style exactly: inline `style={{...}}` objects in CMS editors (not CSS classes), plain CSS classes in `src/App.css` for site-facing components, function components with hooks, no semicolon-free style, no added dependencies.
- `scripts/sanity-schema.js` is documentation only (the CMS is schemaless at the API level) — editing it has no runtime effect and needs no dev-server verification, only a diff review.

---

### Task 1: Document new Sanity schema fields

**Files:**
- Modify: `scripts/sanity-schema.js:11-13` (type list comment), `scripts/sanity-schema.js:160-169` (`siteSettingsSchema`)
- Modify: `scripts/sanity-schema.js` (append new `certificationSchema` after `carouselItemSchema`, i.e. after line 52)

**Interfaces:**
- Produces: no runtime exports consumed by other tasks — this file is documentation-only. Later tasks independently define the same field names (`iframeUrl`, `issuer`, `companyCarouselAutoplay`, `certCarouselAutoplay`) in `sanityClient.js` queries and the CMS editors; keep them spelled identically here.

- [ ] **Step 1: Update the type list comment**

In `scripts/sanity-schema.js`, change:
```js
 * Schema types to create:
 *   hero, carouselItem, project, skillCategory, socialLink,
 *   contentItem, writingItem, siteSettings
```
to:
```js
 * Schema types to create:
 *   hero, carouselItem, certification, project, skillCategory, socialLink,
 *   contentItem, writingItem, siteSettings
```

- [ ] **Step 2: Add `certificationSchema` after `carouselItemSchema`**

Insert immediately after the closing `};` of `carouselItemSchema` (currently line 52), before the `// schemas/project.js` comment:
```js

// schemas/certification.js
export const certificationSchema = {
  name: 'certification',
  title: 'Certification',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'issuer', title: 'Issuer', type: 'string' },
    { name: 'iframeUrl', title: 'Embed Iframe URL', type: 'url' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
};
```

- [ ] **Step 3: Extend `siteSettingsSchema` with the two autoplay fields**

Change:
```js
export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'contactEmail', title: 'Contact Email', type: 'string' },
    { name: 'githubIgnoredRepos', title: 'GitHub Repos to Never Auto-import', type: 'array', of: [{ type: 'string' }] },
  ],
};
```
to:
```js
export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'contactEmail', title: 'Contact Email', type: 'string' },
    { name: 'githubIgnoredRepos', title: 'GitHub Repos to Never Auto-import', type: 'array', of: [{ type: 'string' }] },
    { name: 'companyCarouselAutoplay', title: 'Company Carousel Autoplay', type: 'boolean' },
    { name: 'certCarouselAutoplay', title: 'Certifications Carousel Autoplay', type: 'boolean' },
  ],
};
```

- [ ] **Step 4: Verify**

This file isn't imported at runtime — confirm with:
```bash
grep -rn "sanity-schema" src/ scripts/*.js | grep -v "scripts/sanity-schema.js"
```
Expected: no output (nothing imports it). Read the file back to confirm the edits look correct.

- [ ] **Step 5: Commit**

```bash
git add scripts/sanity-schema.js
git commit -m "docs: add certification schema and carousel autoplay fields"
```

---

### Task 2: Add `certifications` and extend `siteSettings` GROQ queries

**Files:**
- Modify: `src/cms/sanityClient.js:34-38` (add `certifications` after `carousel`), `src/cms/sanityClient.js:66` (`siteSettings`)

**Interfaces:**
- Produces: `queries.certifications` — GROQ string, when fetched returns `Array<{ _id, title, issuer, iframeUrl, order }>`, ordered by `order` ascending. `queries.siteSettings` now also returns `companyCarouselAutoplay` and `certCarouselAutoplay` (booleans, possibly `undefined`).
- Consumed by: Task 7 (`Hero.js` cert fetch), Task 6 & 10 (`Hero.js` settings fetch), Task 11 & 12 (CMS editors).

- [ ] **Step 1: Add the `certifications` query**

In `src/cms/sanityClient.js`, after the `carousel` query (ends at line 38) and before `projects`, insert:
```js

  certifications: `*[_type == "certification"] | order(order asc) {
    _id, title, issuer, iframeUrl, order
  }`,
```

- [ ] **Step 2: Extend the `siteSettings` query**

Change line 66 from:
```js
  siteSettings: `*[_type == "siteSettings"][0] { _id, contactEmail, hiddenWritingUrls, hiddenContentUrls, githubIgnoredRepos }`,
```
to:
```js
  siteSettings: `*[_type == "siteSettings"][0] { _id, contactEmail, hiddenWritingUrls, hiddenContentUrls, githubIgnoredRepos, companyCarouselAutoplay, certCarouselAutoplay }`,
```

- [ ] **Step 3: Verify the query is valid GROQ**

Source your `.env` and query Sanity directly (this dataset likely has zero `certification` documents yet, so expect an empty array — that confirms the query parses, not that data exists):
```bash
source .env && curl -sG "https://${REACT_APP_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${REACT_APP_SANITY_DATASET}" \
  --data-urlencode 'query=*[_type == "certification"] | order(order asc) { _id, title, issuer, iframeUrl, order }'
```
Expected: `{"query":"...","result":[],...}` — no `"error"` key.

- [ ] **Step 4: Commit**

```bash
git add src/cms/sanityClient.js
git commit -m "feat: add certifications query, extend siteSettings query with autoplay flags"
```

---

### Task 3: Add local fallback data file for certifications

**Files:**
- Create: `src/data/certificationsData.json`

**Interfaces:**
- Produces: default export (JSON array) of `{ title, issuer, iframeUrl, order }` objects — same shape `Hero.js` will consume in Task 7, mirroring how `src/data/carouselData.json` is consumed today.

- [ ] **Step 1: Create the file**

```json
[
  {
    "title": "Certification 1",
    "issuer": "HackerRank",
    "iframeUrl": "https://www.hackerrank.com/certificates/iframe/ebe631acf622",
    "order": 0
  },
  {
    "title": "Certification 2",
    "issuer": "HackerRank",
    "iframeUrl": "https://www.hackerrank.com/certificates/iframe/4aeb2125a270",
    "order": 1
  },
  {
    "title": "Certification 3",
    "issuer": "HackerRank",
    "iframeUrl": "https://www.hackerrank.com/certificates/iframe/6c367eb8f0ca",
    "order": 2
  },
  {
    "title": "Certification 4",
    "issuer": "HackerRank",
    "iframeUrl": "https://www.hackerrank.com/certificates/iframe/544ea303a9ac",
    "order": 3
  }
]
```

- [ ] **Step 2: Verify it's valid JSON**

```bash
node -e "console.log(require('./src/data/certificationsData.json').length)"
```
Expected: `4`

- [ ] **Step 3: Commit**

```bash
git add src/data/certificationsData.json
git commit -m "feat: add local fallback data for certifications carousel"
```

---

### Task 4: Extract `useMarqueeCarousel` hook and refactor `HorizontalScroll` to use it

**Files:**
- Create: `src/hooks/useMarqueeCarousel.js`
- Modify: `src/components/Hero.js:54-128` (the `HorizontalScroll` component)

**Interfaces:**
- Produces: `useMarqueeCarousel({ axis: 'x' | 'y', items: Array, autoplay?: boolean })` returning `{ trackRef, doubled, containerHandlers: { onMouseEnter, onMouseLeave }, nudge: (direction: 'prev' | 'next') => void }`.
- Consumed by: `HorizontalScroll` (this task, `axis: 'x'`), `VerticalScroll` (Task 7, `axis: 'y'`).
- This task does NOT wire up `autoplay` or `nudge` yet — `HorizontalScroll` keeps its current always-animating, no-arrows behavior. `autoplay` prop support is added in Task 6, arrow buttons in Task 5. This keeps the refactor itself a pure, behavior-preserving change that's easy to verify in isolation.

- [ ] **Step 1: Create the hook**

```js
// src/hooks/useMarqueeCarousel.js
import { useCallback, useEffect, useRef, useState } from 'react';

const SPEED = 0.5;

const applyTransform = (track, axis, pos) => {
  track.style.transform = axis === 'x' ? `translateX(-${pos}px)` : `translateY(-${pos}px)`;
};

export const useMarqueeCarousel = ({ axis, items, autoplay = true }) => {
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const doubled = [...items, ...items];
  const shouldAnimate = autoplay && !isPaused;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const animate = () => {
      if (shouldAnimate) {
        posRef.current += SPEED;
        const extent = axis === 'x' ? track.scrollWidth : track.scrollHeight;
        const half = extent / 2;
        if (posRef.current >= half) posRef.current = 0;
        applyTransform(track, axis, posRef.current);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [shouldAnimate, axis]);

  const nudge = useCallback((direction) => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    const firstChild = track.children[0];
    const itemSize = axis === 'x' ? firstChild.offsetWidth : firstChild.offsetHeight;
    const gapProp = axis === 'x' ? 'columnGap' : 'rowGap';
    const gap = parseFloat(getComputedStyle(track)[gapProp]) || 0;
    const step = itemSize + gap;
    const extent = axis === 'x' ? track.scrollWidth : track.scrollHeight;
    const half = extent / 2;
    const delta = direction === 'next' ? step : -step;
    posRef.current = ((posRef.current + delta) % half + half) % half;
    applyTransform(track, axis, posRef.current);
  }, [axis]);

  const containerHandlers = {
    onMouseEnter: () => setIsPaused(true),
    onMouseLeave: () => setIsPaused(false),
  };

  return { trackRef, doubled, containerHandlers, nudge };
};
```

- [ ] **Step 2: Refactor `HorizontalScroll` to use the hook**

In `src/components/Hero.js`, add the import at the top of the file (after the existing imports, before `const DEFAULT_HERO`):
```js
import { useMarqueeCarousel } from '../hooks/useMarqueeCarousel';
```

Replace the entire `HorizontalScroll` component (currently lines 54-128) with:
```jsx
const HorizontalScroll = ({ items }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  const { trackRef, doubled, containerHandlers } = useMarqueeCarousel({ axis: 'x', items });

  const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });

  return (
    <>
      <div
        className="carousel-viewport"
        onMouseEnter={containerHandlers.onMouseEnter}
        onMouseLeave={() => { containerHandlers.onMouseLeave(); setHoveredItem(null); }}
        onMouseMove={handleMouseMove}
      >
        <div className="carousel-track" ref={trackRef}>
          {doubled.map((img, i) => (
            <div
              className="carousel-item"
              key={i}
              onMouseEnter={() => setHoveredItem(img)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <img src={img.src || img.srcUrl} alt={img.alt || img.title} />
            </div>
          ))}
        </div>
      </div>

      {hoveredItem && (() => {
        const POPUP_WIDTH = 420;
        const OFFSET = 16;
        const MARGIN = 8;
        const popupHeight = popupRef.current ? popupRef.current.offsetHeight : 400;
        const left = Math.min(cursorPos.x + OFFSET, window.innerWidth - POPUP_WIDTH - MARGIN);
        const top = Math.min(cursorPos.y + OFFSET, window.innerHeight - popupHeight - MARGIN);
        return (
          <div ref={popupRef} className="carousel-popup"
            style={{ position: 'fixed', top, left, pointerEvents: 'none' }}>
            <div className="carousel-popup-header">
              <h3 className="carousel-popup-title">{hoveredItem.title}</h3>
            </div>
            <div className="carousel-popup-body">
              <p className="carousel-popup-description">{hoveredItem.description}</p>
            </div>
          </div>
        );
      })()}
    </>
  );
};
```

- [ ] **Step 3: Verify — regression check in browser**

Ensure the dev server is running (`pnpm run start` in a background terminal if not already). Open `http://localhost:3000`.

Expected, compared to before this task:
- Company carousel still scrolls continuously left at the same visual speed
- Hovering over the carousel still pauses it
- Hovering over an individual logo still shows the title/description popup at the cursor
- No console errors in the browser devtools

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useMarqueeCarousel.js src/components/Hero.js
git commit -m "refactor: extract useMarqueeCarousel hook from HorizontalScroll"
```

---

### Task 5: Add arrow buttons to the company carousel

**Files:**
- Modify: `src/components/Hero.js` (`HorizontalScroll`, from Task 4)
- Modify: `src/App.css` (append new `.carousel-arrow*` rules after the `.carousel-item img` rule, i.e. after line 430)

**Interfaces:**
- Consumes: `nudge` from `useMarqueeCarousel` (Task 4).

- [ ] **Step 1: Destructure `nudge` and add arrow buttons**

In `HorizontalScroll`, change:
```js
  const { trackRef, doubled, containerHandlers } = useMarqueeCarousel({ axis: 'x', items });
```
to:
```js
  const { trackRef, doubled, containerHandlers, nudge } = useMarqueeCarousel({ axis: 'x', items });
```

Change the `carousel-viewport` div's children — from:
```jsx
        <div className="carousel-track" ref={trackRef}>
          {doubled.map((img, i) => (
```
to:
```jsx
        <button type="button" className="carousel-arrow carousel-arrow-left" aria-label="Previous" onClick={() => nudge('prev')}>‹</button>
        <div className="carousel-track" ref={trackRef}>
          {doubled.map((img, i) => (
```
and immediately after the closing `</div>` of `carousel-track` (still inside `carousel-viewport`), add:
```jsx
        <button type="button" className="carousel-arrow carousel-arrow-right" aria-label="Next" onClick={() => nudge('next')}>›</button>
```
So the full `carousel-viewport` block reads:
```jsx
      <div
        className="carousel-viewport"
        onMouseEnter={containerHandlers.onMouseEnter}
        onMouseLeave={() => { containerHandlers.onMouseLeave(); setHoveredItem(null); }}
        onMouseMove={handleMouseMove}
      >
        <button type="button" className="carousel-arrow carousel-arrow-left" aria-label="Previous" onClick={() => nudge('prev')}>‹</button>
        <div className="carousel-track" ref={trackRef}>
          {doubled.map((img, i) => (
            <div
              className="carousel-item"
              key={i}
              onMouseEnter={() => setHoveredItem(img)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <img src={img.src || img.srcUrl} alt={img.alt || img.title} />
            </div>
          ))}
        </div>
        <button type="button" className="carousel-arrow carousel-arrow-right" aria-label="Next" onClick={() => nudge('next')}>›</button>
      </div>
```

- [ ] **Step 2: Add arrow button CSS**

In `src/App.css`, after the `.carousel-item img { ... }` rule (currently ends at line 430), insert:
```css

/* Carousel Arrow Buttons */
.carousel-arrow {
  position: absolute;
  z-index: 5;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--color-white-10);
  background: rgba(20, 20, 20, 0.6);
  color: var(--color-gold);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.carousel-viewport:hover .carousel-arrow {
  opacity: 1;
}

.carousel-arrow:hover {
  background: rgba(255, 216, 115, 0.15);
}

.carousel-arrow-left {
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
}

.carousel-arrow-right {
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
}
```

- [ ] **Step 3: Verify in browser**

Reload `http://localhost:3000`. Hover over the company carousel — two circular arrow buttons should fade in on the left/right edges. Click the right arrow: the carousel should visibly jump forward by roughly one logo's width. Click the left arrow: it should jump back. Click rapidly several times in the same direction near the start/end of the loop — it should keep cycling smoothly, never jumping to a wildly wrong position or stopping.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.js src/App.css
git commit -m "feat: add prev/next arrow buttons to company carousel"
```

---

### Task 6: Wire `companyCarouselAutoplay` from Sanity into the company carousel

**Files:**
- Modify: `src/components/Hero.js` (`Hero` component, lines 130-137 and the `<HorizontalScroll items={carouselItems} />` call at line 161)

**Interfaces:**
- Consumes: `queries.siteSettings` (Task 2).
- Produces: `Hero` now derives `companyCarouselAutoplay` (boolean, default `true`) and passes it as `autoplay` prop to `HorizontalScroll`, which forwards it into `useMarqueeCarousel`.

- [ ] **Step 1: Fetch site settings and derive the flag**

In `Hero.js`, change:
```jsx
const Hero = ({ heroData }) => {
  const [carouselItems, setCarouselItems] = useState(carouselFallback);

  useEffect(() => {
    readClient.fetch(queries.carousel)
      .then((items) => { if (items?.length) setCarouselItems(items); })
      .catch(() => {});
  }, []);
```
to:
```jsx
const Hero = ({ heroData }) => {
  const [carouselItems, setCarouselItems] = useState(carouselFallback);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    readClient.fetch(queries.carousel)
      .then((items) => { if (items?.length) setCarouselItems(items); })
      .catch(() => {});
    readClient.fetch(queries.siteSettings)
      .then((res) => { if (res) setSettings(res); })
      .catch(() => {});
  }, []);

  const companyCarouselAutoplay = settings.companyCarouselAutoplay ?? true;
```

- [ ] **Step 2: Pass the prop through**

Change `HorizontalScroll`'s signature from `({ items }) =>` to `({ items, autoplay }) =>`, and its hook call from:
```js
  const { trackRef, doubled, containerHandlers, nudge } = useMarqueeCarousel({ axis: 'x', items });
```
to:
```js
  const { trackRef, doubled, containerHandlers, nudge } = useMarqueeCarousel({ axis: 'x', items, autoplay });
```

Change the render call at the bottom of `Hero`:
```jsx
      <HorizontalScroll items={carouselItems} />
```
to:
```jsx
      <HorizontalScroll items={carouselItems} autoplay={companyCarouselAutoplay} />
```

- [ ] **Step 3: Verify end-to-end via direct Sanity write**

There's no CMS UI for this flag yet (that's Task 12), so verify by patching Sanity directly:
```bash
source .env
curl -s -X POST "https://${REACT_APP_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${REACT_APP_SANITY_DATASET}" \
  -H "Authorization: Bearer ${REACT_APP_SANITY_TOKEN}" -H "Content-Type: application/json" \
  -d '{"mutations":[{"createIfNotExists":{"_id":"singleton-settings","_type":"siteSettings"}},{"patch":{"id":"singleton-settings","set":{"companyCarouselAutoplay":false}}}]}'
```
Reload `http://localhost:3000` — the company carousel should now be static (arrows should still nudge it manually). Then re-enable:
```bash
source .env
curl -s -X POST "https://${REACT_APP_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${REACT_APP_SANITY_DATASET}" \
  -H "Authorization: Bearer ${REACT_APP_SANITY_TOKEN}" -H "Content-Type: application/json" \
  -d '{"mutations":[{"patch":{"id":"singleton-settings","set":{"companyCarouselAutoplay":true}}}]}'
```
Reload — carousel should be scrolling again.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.js
git commit -m "feat: wire companyCarouselAutoplay setting into company carousel"
```

---

### Task 7: Add `VerticalScroll` component and fetch certification data

**Files:**
- Modify: `src/components/Hero.js` (add `VerticalScroll` component after `HorizontalScroll`; add cert data fetch and temporary render in `Hero`)

**Interfaces:**
- Consumes: `useMarqueeCarousel` (Task 4), `queries.certifications` (Task 2), `src/data/certificationsData.json` (Task 3).
- Produces: `VerticalScroll({ items })` component, rendering each item as an iframe. `autoplay` prop and arrow buttons are NOT added yet (Tasks 9-10) — this task's scope is just "certs render and auto-scroll vertically somewhere on the page," kept separate from the layout restructure (Task 8) so each task has one reviewable change.

- [ ] **Step 1: Import the fallback data**

At the top of `Hero.js`, change:
```js
import carouselFallback from '../data/carouselData.json';
```
to:
```js
import carouselFallback from '../data/carouselData.json';
import certificationsFallback from '../data/certificationsData.json';
```

- [ ] **Step 2: Add the `VerticalScroll` component**

Immediately after the `HorizontalScroll` component's closing `};`, add:
```jsx

const VerticalScroll = ({ items }) => {
  const { trackRef, doubled, containerHandlers } = useMarqueeCarousel({ axis: 'y', items });

  return (
    <div className="cert-carousel-viewport" onMouseEnter={containerHandlers.onMouseEnter} onMouseLeave={containerHandlers.onMouseLeave}>
      <div className="cert-carousel-track" ref={trackRef}>
        {doubled.map((cert, i) => (
          <div className="cert-carousel-item" key={i}>
            <iframe
              src={cert.iframeUrl}
              title={cert.title}
              aria-label={`${cert.title} — ${cert.issuer}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Fetch certifications and render temporarily**

In `Hero`, change:
```jsx
  const [carouselItems, setCarouselItems] = useState(carouselFallback);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    readClient.fetch(queries.carousel)
      .then((items) => { if (items?.length) setCarouselItems(items); })
      .catch(() => {});
    readClient.fetch(queries.siteSettings)
      .then((res) => { if (res) setSettings(res); })
      .catch(() => {});
  }, []);
```
to:
```jsx
  const [carouselItems, setCarouselItems] = useState(carouselFallback);
  const [certItems, setCertItems] = useState(certificationsFallback);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    readClient.fetch(queries.carousel)
      .then((items) => { if (items?.length) setCarouselItems(items); })
      .catch(() => {});
    readClient.fetch(queries.certifications)
      .then((items) => { if (items?.length) setCertItems(items); })
      .catch(() => {});
    readClient.fetch(queries.siteSettings)
      .then((res) => { if (res) setSettings(res); })
      .catch(() => {});
  }, []);
```

Then, immediately after the existing `<HorizontalScroll items={carouselItems} autoplay={companyCarouselAutoplay} />` line, temporarily add:
```jsx
      <VerticalScroll items={certItems} />
```
(This placement is temporary — Task 8 moves it into the two-column layout.)

- [ ] **Step 4: Verify in browser**

Reload `http://localhost:3000`. Below the existing hero content, you should see a new block containing 4 (doubled to 8) embedded HackerRank certificate iframes, scrolling upward continuously and pausing on hover. Layout will look unpolished at this point — that's expected and fixed in Task 8.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.js
git commit -m "feat: add VerticalScroll component and fetch certification data"
```

---

### Task 8: Two-column hero layout

**Files:**
- Modify: `src/components/Hero.js` (`Hero`'s JSX return)
- Modify: `src/App.css:312-319` (`.hero`), append `.hero-row`, `.hero-left`, `.cert-carousel-viewport`, `.cert-carousel-track`, `.cert-carousel-item` rules

**Interfaces:**
- No new interfaces — pure layout/CSS restructure of existing pieces.

- [ ] **Step 1: Restructure `Hero`'s JSX**

Replace the `Hero` component's `return (...)` block — from:
```jsx
  return (
    <section className="hero">
      <div className="hero-bio">
        <div className="hero-image">
          <img src={imageUrl} alt={hero.name} className="hero-profile-image" />
        </div>
        <div className="hero-bio-text">
          <div className="hero-header">
            <h1>Hi, I'm <span className="highlight">{hero.name}</span></h1>
            <p>{hero.tagline}</p>
          </div>
          <div className="hero-about">
            <p style={{ whiteSpace: 'pre-line' }}>
              {renderBioParagraph(bio.join('\n\n'))}
            </p>
          </div>
        </div>
      </div>
      <HorizontalScroll items={carouselItems} autoplay={companyCarouselAutoplay} />
      <VerticalScroll items={certItems} />
    </section>
  );
```
to:
```jsx
  return (
    <section className="hero">
      <div className="hero-row">
        <div className="hero-left">
          <div className="hero-bio">
            <div className="hero-image">
              <img src={imageUrl} alt={hero.name} className="hero-profile-image" />
            </div>
            <div className="hero-bio-text">
              <div className="hero-header">
                <h1>Hi, I'm <span className="highlight">{hero.name}</span></h1>
                <p>{hero.tagline}</p>
              </div>
              <div className="hero-about">
                <p style={{ whiteSpace: 'pre-line' }}>
                  {renderBioParagraph(bio.join('\n\n'))}
                </p>
              </div>
            </div>
          </div>
          <HorizontalScroll items={carouselItems} autoplay={companyCarouselAutoplay} />
        </div>
        <VerticalScroll items={certItems} />
      </div>
    </section>
  );
```

- [ ] **Step 2: Update `.hero` and add the new layout classes**

In `src/App.css`, change:
```css
.hero {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
```
to:
```css
.hero {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-row {
  display: flex;
  align-items: stretch;
  gap: 2.5rem;
}

.hero-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
```

- [ ] **Step 3: Add certification carousel layout CSS**

After the `.carousel-arrow-right { ... }` rule added in Task 5, append:
```css

/* Vertical Certifications Carousel */
.cert-carousel-viewport {
  width: 280px;
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.cert-carousel-track {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  will-change: transform;
  height: max-content;
}

.cert-carousel-item {
  width: 100%;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.cert-carousel-item iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
```

- [ ] **Step 4: Verify in browser**

Reload `http://localhost:3000`. The hero section should now be two columns: left column has the profile/bio and the horizontal company carousel stacked as before; right column is a 280px-wide vertical strip of scrolling certificate iframes, whose height visually matches the full height of the left column (image + bio + company carousel). Resize the browser window narrower/wider and confirm the right column keeps stretching to match.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.js src/App.css
git commit -m "feat: two-column hero layout with vertical certifications carousel"
```

---

### Task 9: Add arrow buttons to the certifications carousel

**Files:**
- Modify: `src/components/Hero.js` (`VerticalScroll`)
- Modify: `src/App.css` (extend the hover-opacity selector; append `.carousel-arrow-up`/`.carousel-arrow-down`)

**Interfaces:**
- Consumes: `nudge` from `useMarqueeCarousel` (Task 4).

- [ ] **Step 1: Destructure `nudge` and add arrow buttons**

In `VerticalScroll`, change:
```js
  const { trackRef, doubled, containerHandlers } = useMarqueeCarousel({ axis: 'y', items });
```
to:
```js
  const { trackRef, doubled, containerHandlers, nudge } = useMarqueeCarousel({ axis: 'y', items });
```

Change the returned JSX from:
```jsx
    <div className="cert-carousel-viewport" onMouseEnter={containerHandlers.onMouseEnter} onMouseLeave={containerHandlers.onMouseLeave}>
      <div className="cert-carousel-track" ref={trackRef}>
```
to:
```jsx
    <div className="cert-carousel-viewport" onMouseEnter={containerHandlers.onMouseEnter} onMouseLeave={containerHandlers.onMouseLeave}>
      <button type="button" className="carousel-arrow carousel-arrow-up" aria-label="Previous" onClick={() => nudge('prev')}>︿</button>
      <div className="cert-carousel-track" ref={trackRef}>
```
and after the `cert-carousel-track` div's closing `</div>` (still inside `cert-carousel-viewport`), add:
```jsx
      <button type="button" className="carousel-arrow carousel-arrow-down" aria-label="Next" onClick={() => nudge('next')}>﹀</button>
```

- [ ] **Step 2: Extend the hover-opacity rule and add up/down positioning**

In `src/App.css`, change:
```css
.carousel-viewport:hover .carousel-arrow {
  opacity: 1;
}
```
to:
```css
.carousel-viewport:hover .carousel-arrow,
.cert-carousel-viewport:hover .carousel-arrow {
  opacity: 1;
}
```

After the `.carousel-arrow-right { ... }` rule, append:
```css

.carousel-arrow-up {
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
}

.carousel-arrow-down {
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
}
```

- [ ] **Step 3: Verify in browser**

Reload `http://localhost:3000`. Hover over the certifications column — up/down arrow buttons should fade in at the top/bottom edges. Click down: the track should jump forward by roughly one certificate tile's height. Click up: it should jump back. Click repeatedly near the loop boundary and confirm it keeps cycling correctly (no jump to a wrong position).

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.js src/App.css
git commit -m "feat: add prev/next arrow buttons to certifications carousel"
```

---

### Task 10: Wire `certCarouselAutoplay` from Sanity into the certifications carousel

**Files:**
- Modify: `src/components/Hero.js` (`Hero` component's settings derivation and `<VerticalScroll>` call)

**Interfaces:**
- Consumes: `settings` state (already fetched in Task 6).

- [ ] **Step 1: Derive the flag and pass it through**

In `Hero`, change:
```js
  const companyCarouselAutoplay = settings.companyCarouselAutoplay ?? true;
```
to:
```js
  const companyCarouselAutoplay = settings.companyCarouselAutoplay ?? true;
  const certCarouselAutoplay = settings.certCarouselAutoplay ?? true;
```

Change `VerticalScroll`'s signature from `({ items }) =>` to `({ items, autoplay }) =>`, and its hook call from:
```js
  const { trackRef, doubled, containerHandlers, nudge } = useMarqueeCarousel({ axis: 'y', items });
```
to:
```js
  const { trackRef, doubled, containerHandlers, nudge } = useMarqueeCarousel({ axis: 'y', items, autoplay });
```

Change the render call:
```jsx
        <VerticalScroll items={certItems} />
```
to:
```jsx
        <VerticalScroll items={certItems} autoplay={certCarouselAutoplay} />
```

- [ ] **Step 2: Verify end-to-end via direct Sanity write**

```bash
source .env
curl -s -X POST "https://${REACT_APP_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${REACT_APP_SANITY_DATASET}" \
  -H "Authorization: Bearer ${REACT_APP_SANITY_TOKEN}" -H "Content-Type: application/json" \
  -d '{"mutations":[{"createIfNotExists":{"_id":"singleton-settings","_type":"siteSettings"}},{"patch":{"id":"singleton-settings","set":{"certCarouselAutoplay":false}}}]}'
```
Reload `http://localhost:3000` — the certifications carousel should now be static (arrows still work). Re-enable:
```bash
source .env
curl -s -X POST "https://${REACT_APP_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${REACT_APP_SANITY_DATASET}" \
  -H "Authorization: Bearer ${REACT_APP_SANITY_TOKEN}" -H "Content-Type: application/json" \
  -d '{"mutations":[{"patch":{"id":"singleton-settings","set":{"certCarouselAutoplay":true}}}]}'
```
Reload — carousel should resume scrolling.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.js
git commit -m "feat: wire certCarouselAutoplay setting into certifications carousel"
```

---

### Task 11: Build the Certifications CMS editor (with autoplay toggle) and register its tab

**Files:**
- Create: `src/cms/editors/CertificationsEditor.js`
- Modify: `src/cms/AdminPanel.js:2-20` (import + `TABS`), `src/cms/AdminPanel.js:100-113` (`renderEditor`)

**Interfaces:**
- Consumes: `queries.certifications`, `queries.siteSettings` (Task 2), `writeClient` (`src/cms/sanityClient.js`), `SortableList` (`src/cms/components/SortableList.js`).
- Produces: full CRUD UI for `certification` documents at the "Certifications" admin tab, plus a toggle button writing `siteSettings.certCarouselAutoplay`.

- [ ] **Step 1: Create the editor**

```jsx
// src/cms/editors/CertificationsEditor.js
import React, { useEffect, useState } from 'react';
import { readClient, writeClient, queries } from '../sanityClient';
import SortableList from '../components/SortableList';

const EMPTY = { title: '', issuer: '', iframeUrl: '', order: 0 };

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(247,247,247,0.2)',
  color: '#F7F7F7',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box',
};
const labelStyle = { fontSize: '13px', color: '#aaa', marginBottom: '4px', display: 'block' };
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
const btn = (color, bg = 'transparent') => ({
  padding: '8px 18px',
  border: `1px solid ${color}`,
  background: bg,
  color,
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 500,
});

const CertificationsEditor = ({ onFeedback }) => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const load = () => readClient.fetch(queries.certifications).then(setItems);

  useEffect(() => {
    load();
    readClient.fetch(queries.siteSettings).then((res) => {
      if (res) setAutoplay(res.certCarouselAutoplay ?? true);
    });
  }, []);

  const toggleAutoplay = async () => {
    const next = !autoplay;
    setAutoplay(next);
    try {
      await writeClient.createIfNotExists({ _type: 'siteSettings', _id: 'singleton-settings' });
      await writeClient.patch('singleton-settings').set({ certCarouselAutoplay: next }).commit();
      onFeedback(`Autoplay ${next ? 'enabled' : 'disabled'}.`, 'success');
    } catch (err) {
      console.error(err);
      onFeedback('Failed to update autoplay.', 'error');
    }
  };

  const startEdit = (item) => { setEditing({ ...item }); setIsNew(false); };
  const startNew = () => { setEditing({ ...EMPTY, order: items.length }); setIsNew(true); };

  const saveItem = async () => {
    if (!editing.title.trim()) { onFeedback('Title is required.', 'error'); return; }
    setSaving(true);
    try {
      const doc = {
        title: editing.title,
        issuer: editing.issuer,
        iframeUrl: editing.iframeUrl,
        order: editing.order,
      };
      if (isNew) {
        await writeClient.create({ _type: 'certification', ...doc });
      } else {
        await writeClient.patch(editing._id).set(doc).commit();
      }
      await load();
      setEditing(null);
      onFeedback('Certification saved!', 'success');
    } catch (err) {
      console.error(err);
      onFeedback('Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await writeClient.delete(id);
      await load();
      onFeedback('Deleted.', 'success');
    } catch {
      onFeedback('Delete failed.', 'error');
    }
  };

  const move = async (idx, dir) => {
    const reordered = [...items];
    const swap = idx + dir;
    [reordered[idx], reordered[swap]] = [reordered[swap], reordered[idx]];
    const patches = reordered.map((item, i) =>
      writeClient.patch(item._id).set({ order: i }).commit()
    );
    await Promise.all(patches);
    await load();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#FFD873' }}>Certifications ({items.length})</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={btn(autoplay ? '#8af0a8' : '#aaa')} onClick={toggleAutoplay}>
            Autoplay: {autoplay ? 'On' : 'Off'}
          </button>
          <button style={btn('#FFD873', 'rgba(255,216,115,0.1)')} onClick={startNew}>+ Add Item</button>
        </div>
      </div>

      <SortableList
        items={items}
        getId={(it) => it._id}
        getLabel={(it) => it.title}
        onMoveUp={(idx) => move(idx, -1)}
        onMoveDown={(idx) => move(idx, 1)}
        onDelete={deleteItem}
        renderItem={(it) => (
          <button style={btn('#FFD873')} onClick={() => startEdit(it)}>Edit</button>
        )}
      />

      {editing && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => setEditing(null)}
        >
          <div
            style={{
              background: '#1e1e1e', border: '1px solid rgba(247,247,247,0.15)',
              borderRadius: '12px', padding: '28px', width: '500px', maxHeight: '85vh',
              overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, color: '#FFD873' }}>{isNew ? 'Add Certification' : 'Edit Certification'}</h3>

            <div style={fieldStyle}>
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Issuer</label>
              <input style={inputStyle} value={editing.issuer} onChange={(e) => setEditing({ ...editing, issuer: e.target.value })} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Embed Iframe URL</label>
              <input style={inputStyle} value={editing.iframeUrl} onChange={(e) => setEditing({ ...editing, iframeUrl: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button style={btn('#aaa')} onClick={() => setEditing(null)}>Cancel</button>
              <button style={btn('#1a1a1a', '#FFD873')} onClick={saveItem} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsEditor;
```

- [ ] **Step 2: Register the tab in `AdminPanel.js`**

Add the import after the existing `SettingsEditor` import (line 9):
```js
import CertificationsEditor from './editors/CertificationsEditor';
```

Add to `TABS` (currently lines 11-20), inserting after the `'carousel'` entry:
```js
const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'social', label: 'Social Links' },
  { id: 'content', label: 'Content' },
  { id: 'writing', label: 'Writing' },
  { id: 'settings', label: 'Settings' },
];
```

Add a `case` in `renderEditor()` (currently lines 100-113), after the `'carousel'` case:
```js
      case 'carousel':       return <CarouselEditor {...props} />;
      case 'certifications': return <CertificationsEditor {...props} />;
```

- [ ] **Step 3: Verify via the admin UI**

Navigate to `http://localhost:3000/admin`, log in, click the new "Certifications" tab. Click "+ Add Item", fill in Title "Test Cert", Issuer "Test Issuer", Embed Iframe URL `https://www.hackerrank.com/certificates/iframe/ebe631acf622`, save. Confirm it appears in the list. Edit it, change the title, save, confirm the change persists. Reorder it with the ↑/↓ buttons. Delete it, confirm it's removed. Click the "Autoplay: On" button — it should flip to "Autoplay: Off" and back on click.

Then reload the main site (`http://localhost:3000`) and confirm any certifications you left in Sanity from this test now render there (delete test data when done so only the real 4 HackerRank certs remain, or leave the local fallback in place if you deleted everything — an empty Sanity result correctly falls back to `certificationsData.json`).

- [ ] **Step 4: Commit**

```bash
git add src/cms/editors/CertificationsEditor.js src/cms/AdminPanel.js
git commit -m "feat: add Certifications CMS editor with autoplay toggle"
```

---

### Task 12: Add autoplay toggle button to the existing Carousel editor

**Files:**
- Modify: `src/cms/editors/CarouselEditor.js`

**Interfaces:**
- Consumes: `queries.siteSettings`, `writeClient` (already imported in this file).

- [ ] **Step 1: Add autoplay state and fetch**

Change:
```js
const CarouselEditor = ({ onFeedback }) => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // item being edited
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const load = () => readClient.fetch(queries.carousel).then(setItems);

  useEffect(() => { load(); }, []);
```
to:
```js
const CarouselEditor = ({ onFeedback }) => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // item being edited
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const load = () => readClient.fetch(queries.carousel).then(setItems);

  useEffect(() => {
    load();
    readClient.fetch(queries.siteSettings).then((res) => {
      if (res) setAutoplay(res.companyCarouselAutoplay ?? true);
    });
  }, []);

  const toggleAutoplay = async () => {
    const next = !autoplay;
    setAutoplay(next);
    try {
      await writeClient.createIfNotExists({ _type: 'siteSettings', _id: 'singleton-settings' });
      await writeClient.patch('singleton-settings').set({ companyCarouselAutoplay: next }).commit();
      onFeedback(`Autoplay ${next ? 'enabled' : 'disabled'}.`, 'success');
    } catch (err) {
      console.error(err);
      onFeedback('Failed to update autoplay.', 'error');
    }
  };
```

- [ ] **Step 2: Add the toggle button next to "+ Add Item"**

Change:
```jsx
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#FFD873' }}>Carousel Items ({items.length})</h3>
        <button style={btn('#FFD873', 'rgba(255,216,115,0.1)')} onClick={startNew}>+ Add Item</button>
      </div>
```
to:
```jsx
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#FFD873' }}>Carousel Items ({items.length})</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={btn(autoplay ? '#8af0a8' : '#aaa')} onClick={toggleAutoplay}>
            Autoplay: {autoplay ? 'On' : 'Off'}
          </button>
          <button style={btn('#FFD873', 'rgba(255,216,115,0.1)')} onClick={startNew}>+ Add Item</button>
        </div>
      </div>
```

- [ ] **Step 3: Verify via the admin UI**

Navigate to `http://localhost:3000/admin` → "Carousel" tab. Click "Autoplay: On" — it should flip to "Autoplay: Off". Open the main site in another tab (or reload it) and confirm the company carousel is now static. Toggle back on in the admin tab, reload the main site, confirm it's scrolling again.

- [ ] **Step 4: Commit**

```bash
git add src/cms/editors/CarouselEditor.js
git commit -m "feat: add autoplay toggle button to Carousel editor"
```

---

### Task 13: Final full regression pass

**Files:** none (verification only)

- [ ] **Step 1: Full manual QA on the dev server**

With `pnpm run start` running, walk through:
1. `http://localhost:3000` — two-column hero renders; left column (image/bio/company carousel) and right column (cert carousel) both visible, right column height matches left column height
2. Company carousel: auto-scrolls, pauses on hover, hover popup shows title/description, both arrows nudge it correctly in both directions
3. Certifications carousel: auto-scrolls vertically, pauses on hover, both arrows nudge it correctly in both directions, all 4 HackerRank certificate iframes render their actual certificate content (not blank/error)
4. `http://localhost:3000/admin` → Carousel tab: autoplay toggle works, reflected on main site after reload
5. `http://localhost:3000/admin` → Certifications tab: autoplay toggle works, reflected on main site after reload; add/edit/delete/reorder all work
6. Browser console: no errors on any of the above pages/interactions
7. Resize the browser window narrow (mobile width) and confirm nothing overflows horizontally or breaks catastrophically (existing responsive behavior for the rest of the site is out of scope to fix, but the new columns shouldn't be badly broken)

- [ ] **Step 2: Report results**

If everything above passes, the feature is complete. If anything fails, return to the relevant task above, fix it there (not with an ad-hoc patch here), and re-verify that task's own verification step before re-running this full pass.
