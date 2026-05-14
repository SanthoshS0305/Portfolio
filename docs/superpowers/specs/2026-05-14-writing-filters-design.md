# Writing Section Filters — Design Spec

**Date:** 2026-05-14
**Status:** Approved

---

## Overview

Add a filter/sort control bar to the Writing section, matching the visual design of the Content section's controls. Introduce a `websiteType` field to the `writingItem` Sanity schema so articles can be labelled by publishing platform (e.g. Substack, Medium, Personal Blog). RSS-fetched articles are automatically tagged "Substack" in the component.

---

## Data Model Changes

### `writingItem` Sanity schema
Add one new field:
- `websiteType` — free-text string (e.g. "Substack", "Medium", "Personal Blog")

### `sanityClient.js` — `writingItems` GROQ query
Add `websiteType` to the projected fields:
```
*[_type == "writingItem"] | order(date desc) {
  _id, title, description, link, websiteType,
  "thumbnailUrl": coalesce(thumbnail.asset->url, thumbnailExternalUrl),
  date
}
```

---

## Component Changes

### `Writing.js`

**RSS auto-tagging:** When mapping RSS items to article objects, inject `websiteType: 'Substack'`. When mapping Sanity items, pass through `item.websiteType || ''`.

**New state:**
- `filterWebsiteType` — string, default `'all'`
- `searchTerm` — string, default `''`
- `sortOrder` — string, default `'newest'` (options: `'newest'`, `'oldest'`, `'az'`, `'za'`)

**Derived values:**
- `websiteTypes` — `['all', ...new Set(articles.map(a => a.websiteType).filter(Boolean))]`
- `filteredArticles` — computed via `useMemo` from `articles` applying search, website type filter, and sort

**Pagination:** `filteredArticles` replaces the current `articles` in the pagination slice. `currentPage` resets to 1 whenever filter state changes.

**Filter bar UI:** Placed between `.writing-header` and `.writing-body`, using a new `writing-controls` CSS class that mirrors `content-controls` (flex, flex-wrap, gap: 10px, margin-bottom: 1.5rem). Three controls:
1. Search `<input>` — filters by title + description (case-insensitive)
2. Website Type `<select>` — "All Sites" + unique `websiteType` values
3. Sort `<select>` — "Newest First" / "Oldest First" / "A–Z" / "Z–A"

All controls share the existing `selectStyle` inline object (matching Content section appearance).

### `WritingEditor.js`

Add a `websiteType` text input field to the edit/add modal, between the Date and Description fields. The `EMPTY` object gains `websiteType: ''`. The `doc` object sent to Sanity on save includes `websiteType: editing.websiteType`.

### `scripts/sanity-schema.js`

Add `websiteType` field to `writingItemSchema`:
```js
{ name: 'websiteType', title: 'Website / Publication', type: 'string' }
```

---

## CSS

Add `.writing-controls` to `App.css`, mirroring `.content-controls`:
```css
.writing-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
}
```

Use the same `selectStyle` inline object as `Content.js` (defined locally in `Writing.js`) for visual consistency — do not use the `.filter-select` / `.sort-select` CSS classes.

---

## Out of Scope

- No changes to RSS fetch logic or caching
- No changes to the Substack subscribe panel
- No date-range filter (date sort covers this need)
- No tag-based filtering (not requested)
