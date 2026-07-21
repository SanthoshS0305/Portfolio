import { createClient } from '@sanity/client';

const config = {
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
};

// Read client — no token, used by all site components
export const readClient = createClient({ ...config, useCdn: false });

// Write client — bypasses CDN, uses auth token, used only by admin panel
export const writeClient = createClient({
  ...config,
  token: process.env.REACT_APP_SANITY_TOKEN,
  useCdn: false,
});

export const uploadImage = async (file) => {
  const asset = await writeClient.assets.upload('image', file, {
    filename: file.name,
    contentType: file.type,
  });
  return { url: asset.url, assetId: asset._id };
};

// GROQ queries used by site components
export const queries = {
  hero: `*[_type == "hero"][0] {
    _id, name, tagline, bio,
    "profileImageUrl": profileImage.asset->url
  }`,

  carousel: `*[_type == "carouselItem"] | order(order asc) {
    _id, title, alt, description,
    "src": coalesce(image.asset->url, srcUrl),
    order
  }`,

  certifications: `*[_type == "certification"] | order(order asc) {
    _id, title, issuer, iframeUrl, order
  }`,

  projects: `*[_type == "project"] | order(order asc) {
    _id, id, title, description, shortDescription, techStack,
    "image": coalesce(image.asset->url, srcUrl),
    features, links, order, githubRepo, isAutoImported,
    githubCreatedAt, githubPushedAt
  }`,

  skillCategories: `*[_type == "skillCategory"] | order(order asc) {
    _id, title, skills, order
  }`,

  socialLinks: `*[_type == "socialLink"] | order(order asc) {
    _id, label, url, icon, order
  }`,

  contentItems: `*[_type == "contentItem"] | order(dateAdded desc) {
    _id, type, url, title, description, platform, category, tags, dateAdded,
    likes, comments, views
  }`,

  writingItems: `*[_type == "writingItem"] | order(date desc) {
    _id, title, description, link, websiteType,
    "thumbnailUrl": coalesce(thumbnail.asset->url, thumbnailExternalUrl),
    date
  }`,

  siteSettings: `*[_type == "siteSettings"][0] { _id, contactEmail, hiddenWritingUrls, hiddenContentUrls, githubIgnoredRepos, companyCarouselAutoplay, certCarouselAutoplay }`,
};
