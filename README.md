# Portfolio

My personal site: React on the frontend, Sanity as the CMS, with a couple of cron jobs keeping the content fresh. Built around a frosted-glass ("liquid glass") visual style.

## What it does

- Hero, Projects, Writing, a content carousel, and About sections all pull their content from Sanity rather than being hardcoded
- Project tiles open a modal with details pulled from the CMS
- A password-protected admin panel at `/admin` lets me edit site content without touching code
- `scripts/sync-github-repos.js` runs daily via GitHub Actions, pulling my public repos from the GitHub API and upserting them into Sanity as project entries
- `scripts/sync-instagram.js` runs weekly, using Apify's Instagram reel scraper to pull recent posts and sync stats (likes, comments, views) into Sanity as content items
- Page views and project clicks are tracked with GA4
- The favicon is generated from whatever profile image is set in the CMS

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, MUI v7 |
| CMS | Sanity (free tier) |
| Analytics | react-ga4 (GA4) |
| Automation | Node.js scripts + GitHub Actions (scheduled) |

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   REACT_APP_SANITY_PROJECT_ID=your_project_id
   REACT_APP_SANITY_DATASET=production
   REACT_APP_SANITY_TOKEN=your_read_token
   REACT_APP_CMS_PASSWORD_HASH=sha256_of_your_password
   ```

3. Seed the CMS (first-time setup only)

   ```bash
   node scripts/seed-sanity.js
   ```

4. Start the dev server

   ```bash
   npm start
   ```

## GitHub repo sync

`scripts/sync-github-repos.js` pulls public repositories from the GitHub API and upserts them into Sanity. It's meant to run as a scheduled GitHub Actions workflow, not locally, and needs three repository secrets:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_WRITE_TOKEN`

## Instagram sync

`scripts/sync-instagram.js` pulls recent posts through Apify's Instagram reel scraper and writes them into Sanity as content items, deduped by post ID so re-running it just refreshes the stats on existing posts. It runs weekly via `.github/workflows/update-instagram.yml`, and can also be triggered manually from the Actions tab or by a `repository_dispatch` event. It needs these secrets and variables:

- `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_TOKEN` (secrets)
- `APIFY_TOKEN` (secret)
- `INSTAGRAM_USERNAME` (repository variable)

To run it locally:

```bash
INSTAGRAM_USERNAME=handle APIFY_TOKEN=xxx node scripts/sync-instagram.js
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Production build |
| `node scripts/seed-sanity.js` | Seed initial CMS content |
| `node scripts/sync-github-repos.js` | Sync GitHub repos to Sanity |
| `node scripts/sync-instagram.js` | Sync Instagram posts to Sanity |
