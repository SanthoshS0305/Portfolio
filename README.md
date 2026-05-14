# Portfolio

A personal portfolio website built with React, backed by a headless CMS and automated GitHub project sync.

## Features

- **Sections** — Hero, Projects, Writing, Content carousel, and About, all driven by Sanity CMS data
- **Project tiles** — Clickable cards that open a detail modal with project info pulled from Sanity
- **Custom admin panel** — CMS editor accessible at `/admin` (password-protected) for managing all site content without touching code
- **GitHub automation** — A daily sync script (`scripts/sync-github-repos.js`) fetches public repos from GitHub and upserts them into Sanity as project entries
- **Google Analytics** — Page views and project-click events tracked via GA4
- **Dynamic favicon** — Profile image set in the CMS is automatically applied as the browser favicon

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, MUI v7 |
| CMS | Sanity (free tier) |
| Analytics | react-ga4 (GA4) |
| Automation | Node.js cron script + GitHub Actions |

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables** — create a `.env` file in the project root:

   ```env
   REACT_APP_SANITY_PROJECT_ID=your_project_id
   REACT_APP_SANITY_DATASET=production
   REACT_APP_SANITY_TOKEN=your_read_token
   REACT_APP_CMS_PASSWORD_HASH=sha256_of_your_password
   ```

3. **Seed the CMS** (first-time setup)

   ```bash
   node scripts/seed-sanity.js
   ```

4. **Start the dev server**

   ```bash
   npm start
   ```

## GitHub Repo Sync

The `scripts/sync-github-repos.js` script pulls public repositories from the GitHub API and upserts them into Sanity. It is designed to run as a scheduled GitHub Actions workflow. Three repository secrets are required:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_WRITE_TOKEN`

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Production build |
| `node scripts/seed-sanity.js` | Seed initial CMS content |
| `node scripts/sync-github-repos.js` | Sync GitHub repos to Sanity |
