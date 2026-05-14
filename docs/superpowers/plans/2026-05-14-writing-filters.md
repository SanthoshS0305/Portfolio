# Writing Section Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a search + website-type filter + sort bar to the Writing section, and a `websiteType` CMS field so articles can be tagged by publishing platform.

**Architecture:** `websiteType` is added to the Sanity `writingItem` schema and GROQ query; RSS articles are auto-tagged `"Substack"` in the component; a `filteredArticles` useMemo applies search, filter, and sort on top of the existing merged `articles` list; the filter bar UI mirrors the Content section's `selectStyle`.

**Tech Stack:** React (hooks, useMemo, useEffect), Sanity GROQ, plain CSS

---

## File Map

| File | Change |
|---|---|
| `scripts/sanity-schema.js` | Add `websiteType` field to `writingItemSchema` |
| `src/cms/sanityClient.js` | Add `websiteType` to `writingItems` GROQ query |
| `src/cms/editors/WritingEditor.js` | Add `websiteType` input to add/edit form |
| `src/components/Writing.js` | Auto-tag RSS, add filter state + `filteredArticles` useMemo, add filter bar UI |
| `src/App.css` | Add `.writing-controls` CSS class |

---

## Task 1: Update Sanity schema and GROQ query

**Files:**
- Modify: `scripts/sanity-schema.js`
- Modify: `src/cms/sanityClient.js`

- [ ] **Step 1: Add `websiteType` to `writingItemSchema` in `sanity-schema.js`**

In `scripts/sanity-schema.js`, find `writingItemSchema.fields` and add the new field after `date`:

```js
// schemas/writingItem.js
export const writingItemSchema = {
  name: 'writingItem',
  title: 'Writing Item',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Preview Text', type: 'text' },
    { name: 'link', title: 'Article URL', type: 'url' },
    { name: 'thumbnail', title: 'Thumbnail Image', type: 'image' },
    { name: 'thumbnailExternalUrl', title: 'Thumbnail URL (fallback)', type: 'url' },
    { name: 'date', title: 'Publication Date', type: 'date' },
    { name: 'websiteType', title: 'Website / Publication', type: 'string' },
  ],
};
```

- [ ] **Step 2: Add `websiteType` to the `writingItems` GROQ query in `sanityClient.js`**

In `src/cms/sanityClient.js`, update the `writingItems` query (currently at line 59):

```js
writingItems: `*[_type == "writingItem"] | order(date desc) {
  _id, title, description, link, websiteType,
  "thumbnailUrl": coalesce(thumbnail.asset->url, thumbnailExternalUrl),
  date
}`,
```

- [ ] **Step 3: Commit**

```bash
git add scripts/sanity-schema.js src/cms/sanityClient.js
git commit -m "feat: add websiteType field to writingItem schema and GROQ query"
```

---

## Task 2: Add websiteType field to WritingEditor CMS form

**Files:**
- Modify: `src/cms/editors/WritingEditor.js`

- [ ] **Step 1: Add `websiteType` to the `EMPTY` object**

In `WritingEditor.js`, change line 8:

```js
const EMPTY = { title: '', description: '', link: '', thumbnailUrl: '', date: '', websiteType: '' };
```

- [ ] **Step 2: Include `websiteType` when saving to Sanity**

In the `saveItem` function, update the `doc` object (around line 97):

```js
const doc = {
  _type: 'writingItem',
  title: editing.title,
  description: editing.description,
  link: editing.link,
  thumbnailExternalUrl: editing.thumbnailUrl,
  date: editing.date,
  websiteType: editing.websiteType,
};
```

- [ ] **Step 3: Add `websiteType` input to the edit/add modal**

In the modal JSX, add this field between the Date field and the Description field (after the `<input type="date" .../>` block, before the Description textarea block):

```jsx
<div style={fieldStyle}><label style={labelStyle}>Website / Publication</label>
  <input
    style={inputStyle}
    value={editing.websiteType}
    onChange={(e) => setEditing({ ...editing, websiteType: e.target.value })}
    placeholder="e.g. Substack, Medium, Personal Blog"
  />
</div>
```

- [ ] **Step 4: Verify manually**

Start the app (`npm start`), open `/admin`, navigate to the Writing editor, click "Add Entry" or "Edit" on an existing entry. Confirm the "Website / Publication" text input appears between Date and Description.

- [ ] **Step 5: Commit**

```bash
git add src/cms/editors/WritingEditor.js
git commit -m "feat: add websiteType input to WritingEditor CMS form"
```

---

## Task 3: Update Writing.js — data and filter logic

**Files:**
- Modify: `src/components/Writing.js`

- [ ] **Step 1: Add `websiteType` to the Sanity article mapping**

In the `useEffect` that fetches from Sanity (around line 134), update the `setSanityArticles` mapping to include `websiteType`:

```js
setSanityArticles(items.map((item) => ({
  title: item.title || '',
  description: item.description || '',
  link: item.link || '',
  thumbnail: item.thumbnailUrl || item.thumbnailExternalUrl || '',
  date: item.date ? new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '',
  rawDate: item.date || '',
  readTime: null,
  websiteType: item.websiteType || '',
})));
```

- [ ] **Step 2: Auto-tag RSS articles as "Substack"**

In the RSS fetch `useEffect` (around line 60), update the `formattedArticles` mapping to include `websiteType`:

```js
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
  rawDate: item.pubDate || '',
  readTime: calculateReadTime(item.content || ''),
  websiteType: 'Substack',
}));
```

- [ ] **Step 3: Remove the date sort from the `articles` useMemo**

The `articles` useMemo (around line 15) currently sorts by date. Remove the sort — `filteredArticles` (added next) will handle all sorting. Replace the useMemo body:

```js
const articles = useMemo(() => {
  const hiddenSet = new Set(hiddenWritingUrls);
  const sanityLinks = new Set(sanityArticles.map((a) => a.link));
  const rssOnly = substackArticles.filter((a) => !sanityLinks.has(a.link) && !hiddenSet.has(a.link));
  return [...sanityArticles, ...rssOnly];
}, [substackArticles, sanityArticles, hiddenWritingUrls]);
```

- [ ] **Step 4: Add filter state variables**

After the existing state declarations (after `const [itemsPerPage, setItemsPerPage] = useState(3);`), add:

```js
const [searchTerm, setSearchTerm] = useState('');
const [filterWebsiteType, setFilterWebsiteType] = useState('all');
const [sortOrder, setSortOrder] = useState('newest');
```

- [ ] **Step 5: Add `filteredArticles` useMemo and `websiteTypes` derived value**

After the `articles` useMemo, add:

```js
const websiteTypes = ['all', ...new Set(articles.map((a) => a.websiteType).filter(Boolean))];

const filteredArticles = useMemo(() => {
  let result = [...articles];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((a) =>
      a.title.toLowerCase().includes(term) ||
      a.description.toLowerCase().includes(term)
    );
  }
  if (filterWebsiteType !== 'all') {
    result = result.filter((a) => a.websiteType === filterWebsiteType);
  }
  result.sort((a, b) => {
    const da = a.rawDate ? new Date(a.rawDate) : 0;
    const db = b.rawDate ? new Date(b.rawDate) : 0;
    if (sortOrder === 'newest') return db - da;
    if (sortOrder === 'oldest') return da - db;
    if (sortOrder === 'az') return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
    if (sortOrder === 'za') return a.title.toLowerCase() > b.title.toLowerCase() ? -1 : 1;
    return db - da;
  });
  return result;
}, [articles, searchTerm, filterWebsiteType, sortOrder]);
```

- [ ] **Step 6: Reset page when filters change**

After the `filteredArticles` useMemo, add:

```js
useEffect(() => { setCurrentPage(1); }, [searchTerm, filterWebsiteType, sortOrder]);
```

- [ ] **Step 7: Update pagination to use `filteredArticles`**

Find these lines (around line 193):

```js
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentArticles = articles.slice(startIndex, endIndex);
const totalPages = Math.ceil(articles.length / itemsPerPage);
```

Replace with:

```js
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentArticles = filteredArticles.slice(startIndex, endIndex);
const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
```

- [ ] **Step 8: Update empty state and pagination buttons to use `filteredArticles`**

In the JSX, find the loading/error/empty chain (around line 225):

```jsx
) : articles.length === 0 ? (
  <div className="writing-empty">No articles found.</div>
) : (
```

Replace with:

```jsx
) : articles.length === 0 ? (
  <div className="writing-empty">No articles found.</div>
) : filteredArticles.length === 0 ? (
  <div className="writing-empty">No results match your filters.</div>
) : (
```

Then find the pagination button disabled props:

```jsx
disabled={currentPage === 1 || articles.length === 0}
```
and:
```jsx
disabled={currentPage === totalPages || articles.length === 0}
```

Replace both with `filteredArticles.length === 0`:

```jsx
disabled={currentPage === 1 || filteredArticles.length === 0}
```
```jsx
disabled={currentPage === totalPages || filteredArticles.length === 0}
```

- [ ] **Step 9: Commit**

```bash
git add src/components/Writing.js
git commit -m "feat: add filter state and filteredArticles logic to Writing component"
```

---

## Task 4: Add filter bar UI to Writing.js and CSS

**Files:**
- Modify: `src/components/Writing.js`
- Modify: `src/App.css`

- [ ] **Step 1: Add `selectStyle` to Writing.js**

At the top of the `Writing` function body (before the state declarations), add:

```js
const selectStyle = {
  padding: '8px 12px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(247,247,247,0.2)',
  color: '#F7F7F7',
  borderRadius: '6px',
  fontSize: '13px',
  cursor: 'pointer',
};
```

- [ ] **Step 2: Add the filter bar JSX**

In the return JSX, between the `.writing-header` div and the `.writing-body` div, insert:

```jsx
<div className="writing-controls">
  <input
    type="text"
    placeholder="Search…"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ ...selectStyle, minWidth: '160px', cursor: 'text' }}
  />
  <select
    style={selectStyle}
    value={filterWebsiteType}
    onChange={(e) => setFilterWebsiteType(e.target.value)}
  >
    {websiteTypes.map((t) => (
      <option key={t} value={t}>{t === 'all' ? 'All Sites' : t}</option>
    ))}
  </select>
  <select
    style={selectStyle}
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
    <option value="az">A–Z</option>
    <option value="za">Z–A</option>
  </select>
</div>
```

- [ ] **Step 3: Add `.writing-controls` to App.css**

In `src/App.css`, find the `.writing-header` block (around line 897) and add the new class after it:

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

- [ ] **Step 4: Verify manually**

Run `npm start`. On the Writing section:
1. Confirm the three controls (search, website type dropdown, sort dropdown) appear between the heading and the article grid.
2. Type in the search box — articles filter in real time.
3. If any Sanity writing entries have `websiteType` set (or after adding one via the CMS), confirm the website type dropdown filters correctly.
4. All RSS articles should appear under "Substack" in the filter.
5. Confirm sorting works: "Oldest First" shows oldest articles first, "A–Z" sorts alphabetically.
6. Confirm the "All Sites" option shows everything.
7. Confirm page resets to 1 when changing any filter.

- [ ] **Step 5: Commit**

```bash
git add src/components/Writing.js src/App.css
git commit -m "feat: add writing section filter bar UI (search, website type, sort)"
```
