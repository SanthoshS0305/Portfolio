#!/usr/bin/env node
/**
 * Syncs public GitHub repos to Sanity as portfolio projects.
 * Run locally: node scripts/sync-github-repos.js
 * (requires .env with REACT_APP_SANITY_* vars, or SANITY_* vars set in environment)
 *
 * Only repos with a README are imported. Already-imported repos are skipped.
 * Repos listed in siteSettings.githubIgnoredRepos are never imported.
 */

require('dotenv').config();
const { createClient } = require('@sanity/client');

const GITHUB_USERNAME = 'SanthoshS0305';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN || process.env.REACT_APP_SANITY_TOKEN,
  useCdn: false,
});

const ghHeaders = process.env.GH_TOKEN
  ? { Authorization: `Bearer ${process.env.GH_TOKEN}` }
  : {};

function titleCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function parseFirstParagraph(readme) {
  const lines = readme.split('\n');
  const paragraphLines = [];
  let started = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('<!--')) continue;
    if (/^!\[/.test(trimmed)) continue; // badge/image lines
    if (trimmed === '') {
      if (started) break;
      continue;
    }
    started = true;
    paragraphLines.push(trimmed);
  }

  return paragraphLines.join(' ');
}

async function fetchReadme(repoName) {
  for (const branch of ['main', 'master']) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${branch}/README.md`,
        { headers: ghHeaders }
      );
      if (res.ok) return await res.text();
    } catch (_) {
      // try next branch
    }
  }
  return null;
}

async function run() {
  console.log('Starting GitHub → Sanity sync...\n');

  // Get ignored repos from siteSettings
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ githubIgnoredRepos }`);
  const ignoredRepos = (settings && settings.githubIgnoredRepos) || [];
  if (ignoredRepos.length) console.log(`Ignored repos: ${ignoredRepos.join(', ')}\n`);

  // Fetch all public repos
  const reposRes = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=public&per_page=100`,
    { headers: ghHeaders }
  );
  if (!reposRes.ok) {
    throw new Error(`GitHub API error: ${reposRes.status} ${await reposRes.text()}`);
  }
  const repos = await reposRes.json();
  console.log(`Found ${repos.length} public repos on GitHub`);

  // Filter: not a fork, not ignored
  const candidates = repos.filter(r => !r.fork && !ignoredRepos.includes(r.name));
  console.log(`${candidates.length} candidates after filtering\n`);

  // Get current max order to place new projects at the end
  const maxOrder = await client.fetch(`*[_type == "project"] | order(order desc)[0].order`);
  let nextOrder = (maxOrder != null ? maxOrder : 0) + 1;

  let added = 0;
  for (const repo of candidates) {
    // Skip repos already in Sanity (dedup by githubRepo field)
    const existing = await client.fetch(
      `*[_type == "project" && githubRepo == $repo][0]._id`,
      { repo: repo.name }
    );
    if (existing) {
      console.log(`  [skip] ${repo.name} — already imported`);
      continue;
    }

    // Require a README
    const readmeContent = await fetchReadme(repo.name);
    if (!readmeContent) {
      console.log(`  [skip] ${repo.name} — no README found`);
      continue;
    }

    // Parse first paragraph; fall back to repo.description
    let description = parseFirstParagraph(readmeContent);
    if (!description) description = repo.description || '';
    if (!description) {
      console.log(`  [skip] ${repo.name} — no usable description`);
      continue;
    }

    const shortDescription = description.length > 150
      ? description.slice(0, 147) + '…'
      : description;

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
      githubCreatedAt: repo.created_at.slice(0, 10),
      githubPushedAt: repo.pushed_at.slice(0, 10),
      order: nextOrder++,
    });

    console.log(`  [added] ${repo.name} — "${titleCase(repo.name)}"`);
    added++;
  }

  console.log(`\nSync complete. ${added} new project(s) added to Sanity.`);

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
}

run().catch(err => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
