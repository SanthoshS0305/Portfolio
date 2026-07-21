# Certifications Vertical Carousel — Design Spec

**Date:** 2026-07-20
**Status:** Approved

---

## Overview

Add a vertical, auto-scrolling certifications carousel to the right of the existing hero content (profile/bio + horizontal company carousel), matching its full height. Each certification tile is a live embedded iframe (e.g. a HackerRank/Credly certificate embed) — no separate image or hover popup. Both the existing horizontal company carousel and the new vertical certifications carousel get: a CMS autoplay toggle, and prev/next arrow buttons that nudge the scroll position by one item.

To guarantee the two carousels behave identically (as required), the shared marquee logic (continuous scroll loop, seamless looping via doubled items, pause-on-hover, arrow nudge) is extracted from the existing `HorizontalScroll` component into a reusable `useMarqueeCarousel` hook, parameterized by axis (`x` or `y`). `HorizontalScroll` is refactored to use it (behavior-preserving); a new `VerticalScroll` component uses it for certifications.

---

## Data Model Changes

### `scripts/sanity-schema.js`

New schema (schemaless API still applies; this is documentation for optional Studio use):

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

Extend `siteSettingsSchema.fields` with:
```js
{ name: 'companyCarouselAutoplay', title: 'Company Carousel Autoplay', type: 'boolean' },
{ name: 'certCarouselAutoplay', title: 'Certifications Carousel Autoplay', type: 'boolean' },
```

### `src/cms/sanityClient.js`

Add a new query:
```js
certifications: `*[_type == "certification"] | order(order asc) {
  _id, title, issuer, iframeUrl, order
}`,
```

Extend the existing `siteSettings` query to include the two new fields:
```js
siteSettings: `*[_type == "siteSettings"][0] {
  _id, contactEmail, hiddenWritingUrls, hiddenContentUrls, githubIgnoredRepos,
  companyCarouselAutoplay, certCarouselAutoplay
}`,
```

Both new booleans are `undefined` on existing/unset documents; treated as `true` (autoplay on) wherever consumed, so existing behavior is unchanged until explicitly toggled off in the CMS.

### `src/data/certificationsData.json` (new)

Local fallback file, same role as `carouselData.json`, seeded with the 4 certificates provided:
```json
[
  { "title": "Certification 1", "issuer": "HackerRank", "iframeUrl": "https://www.hackerrank.com/certificates/iframe/ebe631acf622", "order": 0 },
  { "title": "Certification 2", "issuer": "HackerRank", "iframeUrl": "https://www.hackerrank.com/certificates/iframe/4aeb2125a270", "order": 1 },
  { "title": "Certification 3", "issuer": "HackerRank", "iframeUrl": "https://www.hackerrank.com/certificates/iframe/6c367eb8f0ca", "order": 2 },
  { "title": "Certification 4", "issuer": "HackerRank", "iframeUrl": "https://www.hackerrank.com/certificates/iframe/544ea303a9ac", "order": 3 }
]
```
(Titles are placeholders; real titles/issuers to be edited via the CMS later, same workflow as the company carousel placeholders.)

---

## Component Changes

### `src/hooks/useMarqueeCarousel.js` (new)

```
useMarqueeCarousel({ axis: 'x' | 'y', items, autoplay })
```
Returns:
- `trackRef` — ref for the scrolling track element
- `doubled` — `[...items, ...items]`, for seamless looping
- `containerHandlers` — `{ onMouseEnter, onMouseLeave }` (pause-on-hover)
- `nudge(direction)` — `direction: 'prev' | 'next'`; steps `posRef.current` by the measured size (offsetWidth/offsetHeight, axis-dependent) of the first track child + track gap, wrapped via `((pos % half) + half) % half` against the doubled-track half-extent so repeated "prev" clicks near the start never go negative or desync from the autoplay loop

Internally: same `requestAnimationFrame` loop as today's `HorizontalScroll`, generalized to write `translateX(-Npx)` or `translateY(-Npx)` depending on `axis`, and to read `scrollWidth`/`scrollHeight` depending on `axis`. The rAF loop only advances `posRef.current` when `autoplay && !isPaused` (autoplay is the new CMS-controlled prop; `isPaused` is the existing hover-driven state) — when `autoplay` is `false` the loop still runs (so `nudge()` continues to work) but simply doesn't increment position on its own. `nudge()` updates `posRef.current` and applies `track.style.transform` immediately, rather than waiting for the next tick — necessary since a paused/non-autoplaying carousel must still visibly move the instant an arrow is clicked.

### `src/components/Hero.js`

- `HorizontalScroll` refactored to call `useMarqueeCarousel({ axis: 'x', items, autoplay: companyCarouselAutoplay })`; keeps its existing cursor-tracked hover popup (title/description) — that logic is unaffected by the hook extraction, it just also renders arrow buttons on the viewport edges.
- New `VerticalScroll` component: calls `useMarqueeCarousel({ axis: 'y', items, autoplay: certCarouselAutoplay })`; renders each item as:
  ```jsx
  <div className="cert-carousel-item">
    <iframe src={item.iframeUrl} title={item.title} aria-label={`${item.title} — ${item.issuer}`} />
  </div>
  ```
  No hover popup. Arrow buttons on top/bottom edges of the viewport.
- `Hero` component: adds `certItems` state (seeded from `certificationsData.json`, overridden by `queries.certifications` fetch on mount — same pattern as the existing carousel fetch) and `settings` state (from `queries.siteSettings`, default `{}`). Autoplay flags are read as `const companyCarouselAutoplay = settings.companyCarouselAutoplay ?? true;` / `const certCarouselAutoplay = settings.certCarouselAutoplay ?? true;` so both default to on when the fetch fails or the fields are unset on the document.
- JSX restructure:
  ```jsx
  <section className="hero">
    <div className="hero-row">
      <div className="hero-left">
        <div className="hero-bio">...(unchanged)...</div>
        <HorizontalScroll items={carouselItems} autoplay={companyCarouselAutoplay} />
      </div>
      <VerticalScroll items={certItems} autoplay={certCarouselAutoplay} />
    </div>
  </section>
  ```

### `src/App.css`

- `.hero-row` — `display: flex; gap: 2.5rem; align-items: stretch;` (replaces `.hero` as the flex container for the two columns; `.hero` keeps `max-width`/centering)
- `.hero-left` — `flex: 1; display: flex; flex-direction: column; gap: 2.5rem;` (wraps the existing `.hero-bio` + horizontal carousel, preserving current vertical stacking/gap)
- `.cert-carousel-viewport` — vertical equivalent of `.carousel-viewport`: fixed width (e.g. `280px`), `height: 100%` (stretches to match `.hero-left` via the row's `align-items: stretch`), `overflow: hidden; position: relative;`
- `.cert-carousel-track` — vertical equivalent of `.carousel-track`: `flex-direction: column; gap: 1.25rem; width: 100%;`
- `.cert-carousel-item` — fixed height iframe wrapper (e.g. `220px`) sized to typical certificate-embed aspect ratio; `iframe` inside sized `width: 100%; height: 100%; border: none;`
- `.carousel-arrow` — shared style for both carousels' arrow buttons: small circular button, semi-transparent background, positioned `absolute` at each viewport's edges (`left`/`right` for horizontal, `top`/`bottom` for vertical, via a modifier class), `z-index` above the track, `opacity` transition on hover

### CMS: `src/cms/editors/CarouselEditor.js`

Add an autoplay toggle button in the header row (next to "+ Add Item" / item count), reading/writing `siteSettings.companyCarouselAutoplay` via `readClient`/`writeClient` on mount/click — same `createIfNotExists` + `patch` pattern already used in `SettingsEditor.js`.

### CMS: `src/cms/editors/CertificationsEditor.js` (new)

Mirrors `CarouselEditor.js` structure: list + `SortableList` (reorder via `order` patches), add/edit modal with Title / Issuer / Embed Iframe URL fields (plain text inputs, no `ImageUpload`), delete, and the same autoplay toggle button pattern (`siteSettings.certCarouselAutoplay`).

### `src/cms/AdminPanel.js`

Add `{ id: 'certifications', label: 'Certifications' }` to `TABS`, and a corresponding `case` in `renderEditor()` importing `CertificationsEditor`.

---

## File Map

| File | Change |
|---|---|
| `scripts/sanity-schema.js` | Add `certificationSchema`; extend `siteSettingsSchema` with 2 autoplay booleans |
| `src/cms/sanityClient.js` | Add `certifications` query; extend `siteSettings` query |
| `src/data/certificationsData.json` | New — local fallback, seeded with 4 HackerRank certs |
| `src/hooks/useMarqueeCarousel.js` | New — shared axis-agnostic marquee/pause/nudge hook |
| `src/components/Hero.js` | Refactor `HorizontalScroll` to use hook; add `VerticalScroll`; fetch certifications + siteSettings; two-column JSX restructure |
| `src/App.css` | New `.hero-row`, `.hero-left`, `.cert-carousel-*`, `.carousel-arrow` classes |
| `src/cms/editors/CarouselEditor.js` | Add autoplay toggle button |
| `src/cms/editors/CertificationsEditor.js` | New — mirrors `CarouselEditor.js` |
| `src/cms/AdminPanel.js` | Add "Certifications" tab |

---

## Out of Scope

- No hover popup for certification tiles (iframe is self-explanatory, per decision)
- No credential-link field separate from `iframeUrl` (click-through is handled by the embedded iframe itself)
- No migration/rewrite of `.carousel-item`'s existing horizontal styling beyond what's needed to add arrow buttons
- No automated test suite changes — verification is manual, in-browser (dev server), per existing project convention for UI features
- No changes to how `carouselData.json`/`carouselItem` documents work beyond adding the autoplay flag
