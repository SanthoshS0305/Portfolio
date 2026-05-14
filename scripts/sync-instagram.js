#!/usr/bin/env node
/**
 * Syncs Instagram posts from Apify to Sanity as content items.
 * Run locally: INSTAGRAM_USERNAME=handle APIFY_TOKEN=xxx node scripts/sync-instagram.js
 * (requires .env with SANITY_* vars)
 *
 * Uses createOrReplace with _id = instagram-{shortCode} for deduplication.
 * Re-running updates stats (likes, comments, views) on existing posts.
 */

require('dotenv').config();
const { createClient } = require('@sanity/client');

const APIFY_TOKEN = process.env.APIFY_TOKEN;
const APIFY_ACTOR = 'apify~instagram-post-scraper';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN || process.env.REACT_APP_SANITY_TOKEN,
  useCdn: false,
});

async function run() {
  if (!APIFY_TOKEN) throw new Error('APIFY_TOKEN is required');

  console.log('Starting Instagram → Sanity sync...\n');

  const res = await fetch(
    `https://api.apify.com/v2/acts/${APIFY_ACTOR}/runs/last/dataset/items?token=${APIFY_TOKEN}&format=json`
  );
  if (!res.ok) throw new Error(`Apify API error: ${res.status} ${await res.text()}`);

  const posts = await res.json();
  console.log(`Fetched ${posts.length} posts from Apify`);

  if (posts.length > 0) {
    console.log('Available fields on first post:', Object.keys(posts[0]).join(', '), '\n');
  }

  const reels = posts.filter(p => p.shortCode && p.url && p.url.includes('/reel/'));
  console.log(`${reels.length} Reels (filtered from ${posts.length} total posts)\n`);

  const mutations = reels.map(p => ({
    createOrReplace: {
      _id: `instagram-${p.shortCode}`,
      _type: 'contentItem',
      type: 'instagram',
      platform: 'Instagram',
      url: p.url,
      title: (p.caption || '').slice(0, 80) || 'Instagram Reel',
      description: p.caption || '',
      category: 'SBCS',
      tags: ['Stony Brook', 'Computer Science', 'SBCS'],
      dateAdded: p.timestamp ? p.timestamp.slice(0, 10) : null,
      likes: p.likesCount ?? null,
      comments: p.commentsCount ?? null,
      views: p.videoViewCount ?? p.videoPlayCount ?? p.playCount ?? null,
    },
  }));

  if (!mutations.length) {
    console.log('No Reels to sync.');
    return;
  }

  await client.mutate(mutations);
  console.log(`Sync complete. ${mutations.length} Reel(s) upserted to Sanity.`);
}

run().catch(err => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
