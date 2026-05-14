#!/usr/bin/env node
/**
 * One-time Sanity seed script.
 * Run after creating your Sanity project and setting up .env:
 *   node scripts/seed-sanity.js
 *
 * Requires a .env file with:
 *   REACT_APP_SANITY_PROJECT_ID
 *   REACT_APP_SANITY_DATASET
 *   REACT_APP_SANITY_TOKEN
 */

require('dotenv').config();
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.REACT_APP_SANITY_TOKEN,
  useCdn: false,
});

if (!process.env.REACT_APP_SANITY_PROJECT_ID || !process.env.REACT_APP_SANITY_TOKEN) {
  console.error('ERROR: Missing REACT_APP_SANITY_PROJECT_ID or REACT_APP_SANITY_TOKEN in .env');
  process.exit(1);
}

const dataDir = path.join(__dirname, '..', 'src', 'data');

const carouselData = JSON.parse(fs.readFileSync(path.join(dataDir, 'carouselData.json'), 'utf8'));
const projectsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'projects.json'), 'utf8'));
const contentData = JSON.parse(fs.readFileSync(path.join(dataDir, 'content.json'), 'utf8'));

async function seed() {
  console.log('🌱 Starting Sanity seed...\n');

  // 1. Hero (singleton)
  console.log('Creating hero document…');
  await client.createOrReplace({
    _id: 'singleton-hero',
    _type: 'hero',
    name: 'Santhosh Senthil',
    tagline: 'Computer Science Student, Professional Content Creator, and Writer',
    bio: [
      "I'm a Computer Science Student Minoring in Writing and Rhetoric at Stony Brook University in New York. I'm also a professional content creator and writer. I am currently an **Assistant Digital Marketing Coordinator for Thump Local**, and a **research assistant for PoliTech, under Professor Robert Kelly**.",
      "I am passionate about computers and people. That is why I am a **Peer Mentor** for the **College of Engineering and Applied Sciences' Peer Mentoring Program**. I was also the **Vice President of the SBU Game Development and Design Club** and the **Public Relations Officer for the Stony Brook Computing Society**.",
      "As an avid artist, I love creating [social media content](scroll:content) for various organizations. I am also an avid writer, and you can check out my [writing portfolio](scroll:writing). You can also check out my [coding projects](scroll:projects) if you're interested in my work.",
    ],
  });
  console.log('  ✓ Hero created');

  // 2. Site settings (singleton)
  console.log('Creating site settings…');
  await client.createOrReplace({
    _id: 'singleton-settings',
    _type: 'siteSettings',
    contactEmail: 'santhoshs0305@gmail.com',
  });
  console.log('  ✓ Site settings created');

  // 3. Carousel items
  console.log(`Creating ${carouselData.length} carousel items…`);
  for (let i = 0; i < carouselData.length; i++) {
    const item = carouselData[i];
    await client.create({
      _type: 'carouselItem',
      title: item.title,
      alt: item.alt,
      description: item.description,
      srcUrl: item.src,
      order: i,
    });
  }
  console.log('  ✓ Carousel items created');

  // 4. Projects
  const projects = projectsData.projects;
  console.log(`Creating ${projects.length} projects…`);
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await client.create({
      _type: 'project',
      id: p.id,
      title: p.title,
      description: p.description,
      shortDescription: p.shortDescription,
      techStack: p.techStack,
      srcUrl: p.image,
      features: p.features,
      links: p.links,
      order: i,
    });
  }
  console.log('  ✓ Projects created');

  // 5. Skill categories
  console.log('Creating skill categories…');
  const skillCategories = [
    { title: 'Programming Languages', skills: ['Java', 'Python', 'JavaScript', 'React JS', 'C'], order: 0 },
    { title: 'Development', skills: ['Game Development', 'Web Development', 'Machine Learning (Spacy)', 'NLP (Sentence Transformers)', 'Full Stack Development'], order: 1 },
    { title: 'Tools & Technologies', skills: ['Git and GitHub', 'Discord API', 'Web Audio API', 'Unity and Godot Engine'], order: 2 },
  ];
  for (const cat of skillCategories) {
    await client.create({ _type: 'skillCategory', ...cat });
  }
  console.log('  ✓ Skill categories created');

  // 6. Social links
  console.log('Creating social links…');
  const socialLinks = [
    { label: 'GitHub', url: 'https://github.com/SanthoshS0305', icon: 'github', order: 0 },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/santhosh-senthil-589164249/', icon: 'linkedin', order: 1 },
    { label: 'Instagram', url: 'https://www.instagram.com/s.senthil05/', icon: 'instagram', order: 2 },
    { label: 'Substack', url: 'https://dashesnothyphens.substack.com', icon: 'substack', order: 3 },
  ];
  for (const link of socialLinks) {
    await client.create({ _type: 'socialLink', ...link });
  }
  console.log('  ✓ Social links created');

  // 7. Manual content items
  const manualContent = contentData.content || [];
  if (manualContent.length > 0) {
    console.log(`Creating ${manualContent.length} content items…`);
    for (const item of manualContent) {
      await client.create({
        _type: 'contentItem',
        type: item.type,
        url: item.url,
        title: item.title,
        description: item.description,
        platform: item.platform,
        category: item.category,
        tags: item.tags || [],
        dateAdded: item.dateAdded,
        likes: item.likes ?? null,
        comments: item.comments ?? null,
        views: item.views ?? null,
      });
    }
    console.log('  ✓ Content items created');
  }

  console.log('\n✅ Seed complete! Your Sanity project is ready.');
  console.log('\nNext step: add your Sanity schema definitions.');
  console.log('See the README or project docs for schema setup instructions.');
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
