# Projects Section Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add search, tech-stack filter, and sort controls to the Projects section, with GitHub date fields saved by the sync script (new and backfill).

**Architecture:** `githubCreatedAt` and `githubPushedAt` are added to the Sanity project schema and populated by the GitHub sync script on new imports and via a backfill loop for existing projects; `filteredProjects` useMemo applies search/filter/sort on top of `allProjects`; the filter bar UI mirrors Writing and Content sections using the same `selectStyle` pattern.

**Tech Stack:** React (hooks, useMemo, useEffect), Sanity GROQ, Node.js (sync script), plain CSS

---

## File Map

| File | Change |
|---|---|
| `scripts/sanity-schema.js` | Add `githubCreatedAt`, `githubPushedAt` to `projectSchema` |
| `src/cms/sanityClient.js` | Add both fields to `projects` GROQ query |
| `scripts/sync-github-repos.js` | Save dates on CREATE; add backfill loop after main sync |
| `src/components/ProjectTiles.js` | Add `useMemo` import, filter state, `techOptions`+`filteredProjects` memos, page-reset effect, update pagination + stats |
| `src/App.css` | Add `.projects-controls` CSS class |

---

## Task 1: Update Sanity schema and GROQ query

**Files:**
- Modify: `scripts/sanity-schema.js`
- Modify: `src/cms/sanityClient.js`

- [ ] **Step 1: Add `githubCreatedAt` and `githubPushedAt` to `projectSchema`**

In `scripts/sanity-schema.js`, find the end of `projectSchema.fields` (after `isAutoImported` on line 90). Add the two new fields before the closing `]`:

```js
export const projectSchema = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'id', title: 'Numeric ID (legacy)', type: 'number' },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'shortDescription', title: 'Short Description', type: 'string' },
    { name: 'description', title: 'Full Description', type: 'text' },
    { name: 'techStack', title: 'Tech Stack', type: 'array', of: [{ type: 'string' }] },
    { name: 'image', title: 'Screenshot', type: 'image' },
    { name: 'srcUrl', title: 'Image URL (fallback)', type: 'url' },
    {
      name: 'features', title: 'Features', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Label', type: 'string' },
          { name: 'text', title: 'Description', type: 'text' },
        ],
      }],
    },
    {
      name: 'links', title: 'Links', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'url', title: 'URL', type: 'url' },
          { name: 'text', title: 'Link Text', type: 'string' },
          { name: 'icon', title: 'Icon', type: 'string', options: { list: ['github', 'external', 'demo', 'itch'] } },
        ],
      }],
    },
    { name: 'order', title: 'Display Order', type: 'number' },
    { name: 'githubRepo', title: 'GitHub Repo Name (auto-import key)', type: 'string' },
    { name: 'isAutoImported', title: 'Auto-imported from GitHub', type: 'boolean' },
    { name: 'githubCreatedAt', title: 'GitHub Repo Created Date', type: 'date' },
    { name: 'githubPushedAt', title: 'GitHub Last Push Date', type: 'date' },
  ],
};
```

- [ ] **Step 2: Add both date fields to the `projects` GROQ query**

In `src/cms/sanityClient.js`, find the `projects` query (around line 40). Replace it with:

```js
projects: `*[_type == "project"] | order(order asc) {
  _id, id, title, description, shortDescription, techStack,
  "image": coalesce(image.asset->url, srcUrl),
  features, links, order, githubRepo, isAutoImported,
  githubCreatedAt, githubPushedAt
}`,
```

- [ ] **Step 3: Commit**

```bash
git add scripts/sanity-schema.js src/cms/sanityClient.js
git commit -m "feat: add githubCreatedAt and githubPushedAt to project schema and GROQ query"
```

---

## Task 2: Update sync script — save dates and backfill

**Files:**
- Modify: `scripts/sync-github-repos.js`

- [ ] **Step 1: Add date fields to the `client.create` call**

In `scripts/sync-github-repos.js`, find the `client.create` call inside the `for (const repo of candidates)` loop (around line 128). Add both date fields:

```js
await client.create({
  _type: 'project',
  title: titleCase(repo.name),
  description,
  shortDescription,
  techStack: repo.language ? [repo.language] : [],
  features: [],
  links: [{ url: repo.html_url, text: 'GitHub', icon: 'github' }],
  githubRepo: repo.name,
  isAutoImported: true,
  order: nextOrder++,
  githubCreatedAt: repo.created_at.slice(0, 10),
  githubPushedAt: repo.pushed_at.slice(0, 10),
});
```

- [ ] **Step 2: Add the backfill loop at the end of `run()`**

After the `console.log(`\nSync complete. ${added} new project(s) added to Sanity.`);` line, add the backfill block. It fetches every Sanity project with a `githubRepo` field and patches its dates from the GitHub API:

```js
// Backfill GitHub dates for all auto-imported projects
console.log('\nBackfilling GitHub dates for existing projects...');
const existingProjects = await client.fetch(
  `*[_type == "project" && defined(githubRepo)]{ _id, githubRepo }`
);
let backfilled = 0;
for (const project of existingProjects) {
  try {
    const repoRes = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${project.githubRepo}`,
      { headers: ghHeaders }
    );
    if (!repoRes.ok) {
      console.log(`  [skip] ${project.githubRepo} — GitHub API ${repoRes.status}`);
      continue;
    }
    const repo = await repoRes.json();
    await client.patch(project._id).set({
      githubCreatedAt: repo.created_at.slice(0, 10),
      githubPushedAt: repo.pushed_at.slice(0, 10),
    }).commit();
    console.log(`  [updated] ${project.githubRepo} — pushed: ${repo.pushed_at.slice(0, 10)}`);
    backfilled++;
  } catch (err) {
    console.log(`  [error] ${project.githubRepo} — ${err.message}`);
  }
}
console.log(`Backfill complete. ${backfilled} project(s) updated.`);
```

- [ ] **Step 3: Commit**

```bash
git add scripts/sync-github-repos.js
git commit -m "feat: save githubCreatedAt/githubPushedAt in sync script and backfill existing projects"
```

---

## Task 3: ProjectTiles.js — filter state and logic

**Files:**
- Modify: `src/components/ProjectTiles.js`

- [ ] **Step 1: Add `useMemo` to the React import**

Line 1 currently reads:
```js
import React, { useState, useEffect } from 'react';
```

Replace with:
```js
import React, { useState, useEffect, useMemo } from 'react';
```

- [ ] **Step 2: Add filter state variables**

After `const [currentPage, setCurrentPage] = useState(1);` (line 7), add:

```js
const [searchTerm, setSearchTerm] = useState('');
const [filterTech, setFilterTech] = useState('all');
const [sortOrder, setSortOrder] = useState('default');
```

- [ ] **Step 3: Add `techOptions` and `filteredProjects` memos**

After the new state declarations, add both memos. `techOptions` derives unique sorted tech values; `filteredProjects` applies search → tech filter → sort in that order:

```js
const techOptions = useMemo(() => {
  const all = allProjects.flatMap((p) => p.techStack || []);
  return ['all', ...Array.from(new Set(all)).sort()];
}, [allProjects]);

const filteredProjects = useMemo(() => {
  let result = [...allProjects];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((p) =>
      p.title.toLowerCase().includes(term) ||
      (p.shortDescription || '').toLowerCase().includes(term) ||
      (p.techStack || []).some((t) => t.toLowerCase().includes(term)) ||
      (p.features || []).some((f) => (f.label || '').toLowerCase().includes(term))
    );
  }
  if (filterTech !== 'all') {
    result = result.filter((p) => (p.techStack || []).includes(filterTech));
  }
  result.sort((a, b) => {
    if (sortOrder === 'default') return (a.order ?? 999) - (b.order ?? 999);
    if (sortOrder === 'lastcommit') {
      if (!a.githubPushedAt && !b.githubPushedAt) return 0;
      if (!a.githubPushedAt) return 1;
      if (!b.githubPushedAt) return -1;
      return b.githubPushedAt.localeCompare(a.githubPushedAt);
    }
    if (sortOrder === 'projectstart') {
      if (!a.githubCreatedAt && !b.githubCreatedAt) return 0;
      if (!a.githubCreatedAt) return 1;
      if (!b.githubCreatedAt) return -1;
      return b.githubCreatedAt.localeCompare(a.githubCreatedAt);
    }
    if (sortOrder === 'az') return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    if (sortOrder === 'za') return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
    return 0;
  });
  return result;
}, [allProjects, searchTerm, filterTech, sortOrder]);
```

- [ ] **Step 4: Add page-reset effect**

After the `filteredProjects` useMemo, add:

```js
useEffect(() => { setCurrentPage(1); }, [searchTerm, filterTech, sortOrder]);
```

- [ ] **Step 5: Update pagination to use `filteredProjects`**

Find these three lines (around line 21):

```js
const totalPages = Math.ceil(allProjects.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentProjects = allProjects.slice(startIndex, endIndex);
```

Replace with:

```js
const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentProjects = filteredProjects.slice(startIndex, endIndex);
```

- [ ] **Step 6: Update the existing page-guard effect**

Find the existing useEffect that guards against currentPage exceeding totalPages:

```js
useEffect(() => {
  const newTotalPages = Math.ceil(allProjects.length / itemsPerPage);
  if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
}, [itemsPerPage, allProjects.length, currentPage]);
```

Replace with:

```js
useEffect(() => {
  const newTotalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
}, [itemsPerPage, filteredProjects.length, currentPage]);
```

- [ ] **Step 7: Commit**

```bash
git add src/components/ProjectTiles.js
git commit -m "feat: add filter state and filteredProjects logic to ProjectTiles"
```

---

## Task 4: ProjectTiles.js — filter bar UI, stats text, and CSS

**Files:**
- Modify: `src/components/ProjectTiles.js`
- Modify: `src/App.css`

- [ ] **Step 1: Add `selectStyle` to ProjectTiles.js**

At the top of the `ProjectTiles` function body (before the state declarations), add:

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

In the return JSX, between the `.projects-header` div and the `.projects-stats` div, insert:

```jsx
<div className="projects-controls">
  <input
    type="text"
    aria-label="Search projects"
    placeholder="Search…"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ ...selectStyle, minWidth: '160px', cursor: 'text' }}
  />
  <select
    aria-label="Filter by tech"
    style={selectStyle}
    value={filterTech}
    onChange={(e) => setFilterTech(e.target.value)}
  >
    {techOptions.map((t) => (
      <option key={t} value={t}>{t === 'all' ? 'All Tech' : t}</option>
    ))}
  </select>
  <select
    aria-label="Sort order"
    style={selectStyle}
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
  >
    <option value="default">Default Order</option>
    <option value="lastcommit">Last Commit</option>
    <option value="projectstart">Project Start</option>
    <option value="az">A–Z</option>
    <option value="za">Z–A</option>
  </select>
</div>
```

- [ ] **Step 3: Update the stats text**

Find the `.projects-stats` JSX (around line 44):

```jsx
<div className="projects-stats">
  <p>
    Showing {startIndex + 1}–{Math.min(endIndex, allProjects.length)} of {allProjects.length} projects
    {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
  </p>
</div>
```

Replace with:

```jsx
<div className="projects-stats">
  <p>
    Showing {startIndex + 1}–{Math.min(endIndex, filteredProjects.length)} of{' '}
    {filteredProjects.length !== allProjects.length
      ? `${filteredProjects.length} matching projects (${allProjects.length} total)`
      : `${allProjects.length} projects`}
    {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
  </p>
</div>
```

- [ ] **Step 4: Add `.projects-controls` to App.css**

In `src/App.css`, find the `.projects-header p` block (line 237) and add the new class immediately after it (before `.projects-stats`):

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

- [ ] **Step 5: Verify manually**

The dev server should already be running at `http://localhost:3000`. Check the Projects section:
1. Filter bar (search, All Tech dropdown, Default Order dropdown) appears between heading and stats line
2. Typing in search filters projects by title, description, tech tag, and feature label
3. Tech dropdown shows unique tech values from all projects alphabetically; selecting one filters correctly
4. Sort "A–Z" sorts alphabetically; "Last Commit" and "Project Start" require the sync script to have been run first (see below)
5. Stats line reads "Showing 1–6 of 18 projects" when unfiltered; "Showing 1–3 of 3 matching projects (18 total)" when filtered
6. Page resets to 1 when any filter changes

- [ ] **Step 6: Commit**

```bash
git add src/components/ProjectTiles.js src/App.css
git commit -m "feat: add projects section filter bar UI and updated stats text"
```

---

## Task 5: Run sync script to backfill dates (manual step)

This task is a manual one-time operation, not an automated build step.

- [ ] **Step 1: Ensure environment variables are set**

The sync script needs these variables in `.env` at the repo root (or exported in your shell):
- `REACT_APP_SANITY_PROJECT_ID` (or `SANITY_PROJECT_ID`)
- `REACT_APP_SANITY_DATASET` (or `SANITY_DATASET`, default: `production`)
- `REACT_APP_SANITY_TOKEN` (or `SANITY_TOKEN`) — must have write permission
- `GH_TOKEN` — GitHub personal access token (needed to avoid 60 req/hr rate limit)

- [ ] **Step 2: Run the sync script**

```bash
node scripts/sync-github-repos.js
```

Expected output pattern:
```
Starting GitHub → Sanity sync...

Found N public repos on GitHub
M candidates after filtering

  [skip] repo-name — already imported
  ...

Sync complete. 0 new project(s) added to Sanity.

Backfilling GitHub dates for existing projects...
  [updated] repo-name — pushed: 2025-03-14
  [updated] repo-name — pushed: 2024-11-02
  ...
Backfill complete. N project(s) updated.
```

- [ ] **Step 3: Verify in browser**

After the sync completes, hard-refresh `http://localhost:3000`. Select "Last Commit" or "Project Start" from the sort dropdown — projects should now sort by those dates. Projects without a GitHub repo field will sort last.
