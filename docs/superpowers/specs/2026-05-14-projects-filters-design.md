# Projects Section Filters — Design Spec

**Date:** 2026-05-14
**Status:** Approved

---

## Overview

Add search, tech-stack filter, and sort controls to the Projects section. Introduce `githubCreatedAt` and `githubPushedAt` date fields to the Sanity `project` schema, saved by the GitHub sync script (new projects and backfill of existing). The filter bar mirrors the visual design of the Writing and Content sections.

---

## Data Model Changes

### `scripts/sanity-schema.js`
Add two fields to `projectSchema`:
```js
{ name: 'githubCreatedAt', title: 'GitHub Repo Created Date', type: 'date' },
{ name: 'githubPushedAt',  title: 'GitHub Last Push Date',    type: 'date' },
```

### `src/cms/sanityClient.js` — `projects` GROQ query
Add both fields to the projection:
```
*[_type == "project"] | order(order asc) {
  _id, id, title, description, shortDescription, techStack,
  "image": coalesce(image.asset->url, srcUrl),
  features, links, order, githubRepo, isAutoImported,
  githubCreatedAt, githubPushedAt
}
```

### `scripts/sync-github-repos.js`
Two changes:

**On CREATE** — include both date fields:
```js
githubCreatedAt: repo.created_at.slice(0, 10),
githubPushedAt:  repo.pushed_at.slice(0, 10),
```

**Backfill loop** — runs after the main sync loop. Fetches all Sanity projects that have a `githubRepo` value (auto-imported), calls the GitHub API for each, and patches `githubCreatedAt` / `githubPushedAt`. Patches unconditionally (not just when missing) so re-running the sync always keeps dates fresh.

---

## Component Changes

### `src/components/ProjectTiles.js`

**New state:**
- `searchTerm` — string, default `''`
- `filterTech` — string, default `'all'`
- `sortOrder` — string, default `'default'`

**Derived values (memoised):**
- `techOptions` — `['all', ...unique techStack values from allProjects, sorted alphabetically]`
- `filteredProjects` — useMemo over `[allProjects, searchTerm, filterTech, sortOrder]`

**Search logic** (case-insensitive, applied before filter and sort):
- `project.title`
- `project.shortDescription`
- Any item in `project.techStack`
- Any `project.features[].label`

**Filter logic:**
- `filterTech !== 'all'` → keep only projects where `techStack` includes `filterTech`

**Sort logic:**

| `sortOrder` value | Behaviour |
|---|---|
| `'default'` | `order` field ascending (current behaviour) |
| `'lastcommit'` | `githubPushedAt` descending; missing dates sort last |
| `'projectstart'` | `githubCreatedAt` descending; missing dates sort last |
| `'az'` | title `localeCompare` ascending |
| `'za'` | title `localeCompare` descending |

Projects with missing date fields (`githubPushedAt` / `githubCreatedAt`) sort after all dated projects on date-based sort options.

**Page reset:** `useEffect(() => { setCurrentPage(1); }, [searchTerm, filterTech, sortOrder])`

**Pagination:** all references to `allProjects.length` and `allProjects.slice(...)` in the pagination/display block replaced with `filteredProjects.length` / `filteredProjects.slice(...)`.

**Stats text:**
- Unfiltered: `Showing X–Y of N projects`
- Filtered: `Showing X–Y of M matching projects (N total)`
  — where M = `filteredProjects.length`, N = `allProjects.length`

**`selectStyle` object** — defined at the top of the component function body, same values as Writing and Content sections.

**Filter bar JSX** — placed between `.projects-header` and `.projects-stats` divs:
```jsx
<div className="projects-controls">
  <input type="text" aria-label="Search projects" placeholder="Search…"
    value={searchTerm} onChange={...}
    style={{ ...selectStyle, minWidth: '160px', cursor: 'text' }} />
  <select aria-label="Filter by tech" style={selectStyle}
    value={filterTech} onChange={...}>
    {techOptions.map(t => <option key={t} value={t}>{t === 'all' ? 'All Tech' : t}</option>)}
  </select>
  <select aria-label="Sort order" style={selectStyle}
    value={sortOrder} onChange={...}>
    <option value="default">Default Order</option>
    <option value="lastcommit">Last Commit</option>
    <option value="projectstart">Project Start</option>
    <option value="az">A–Z</option>
    <option value="za">Z–A</option>
  </select>
</div>
```

### `src/App.css`
Add `.projects-controls` class after `.projects-stats`:
```css
.projects-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
}
```

---

## File Map

| File | Change |
|---|---|
| `scripts/sanity-schema.js` | Add `githubCreatedAt`, `githubPushedAt` to `projectSchema` |
| `src/cms/sanityClient.js` | Add both fields to `projects` GROQ query |
| `scripts/sync-github-repos.js` | Save dates on CREATE; add backfill loop |
| `src/components/ProjectTiles.js` | Filter state, `filteredProjects` useMemo, filter bar UI, stats update |
| `src/App.css` | Add `.projects-controls` CSS class |

---

## Out of Scope

- No changes to `ProjectModal` or `ProjectDetail`
- No CMS editor changes (dates come from GitHub only)
- No ascending variants of date sorts (single "Last Commit" and "Project Start" options suffice)
- No tag-based filter UI (dropdown covers the need)
