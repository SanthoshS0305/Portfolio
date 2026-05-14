/**
 * Sanity schema definitions for the portfolio CMS.
 *
 * HOW TO USE:
 * 1. In your Sanity project directory (created with `npm create sanity@latest`),
 *    paste each schema below into separate files in the `schemas/` folder.
 *
 * OR use the Sanity management console's Schema tab at:
 *    https://www.sanity.io/manage
 *
 * Schema types to create:
 *   hero, carouselItem, project, skillCategory, socialLink,
 *   contentItem, writingItem, siteSettings
 *
 * -----------------------------------------------------------------
 * QUICKEST SETUP: Use Sanity's API without a Studio
 * -----------------------------------------------------------------
 * The portfolio reads/writes directly via the Sanity HTTP API using GROQ.
 * You do NOT need a separate Sanity Studio or schema file to use the CMS —
 * the documents are created by the seed script with implicit schema.
 * Sanity is schemaless by default on the API level.
 *
 * If you want to also set up Sanity Studio (optional), use the schemas below.
 */

// schemas/hero.js
export const heroSchema = {
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'tagline', title: 'Tagline', type: 'string' },
    { name: 'bio', title: 'Bio Paragraphs', type: 'array', of: [{ type: 'text' }] },
    { name: 'profileImage', title: 'Profile Image', type: 'image', options: { hotspot: true } },
  ],
};

// schemas/carouselItem.js
export const carouselItemSchema = {
  name: 'carouselItem',
  title: 'Carousel Item',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'alt', title: 'Alt Text', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Image', type: 'image' },
    { name: 'srcUrl', title: 'Image URL (fallback)', type: 'url' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
};

// schemas/project.js
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

// schemas/skillCategory.js
export const skillCategorySchema = {
  name: 'skillCategory',
  title: 'Skill Category',
  type: 'document',
  fields: [
    { name: 'title', title: 'Category Name', type: 'string' },
    { name: 'skills', title: 'Skills', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
};

// schemas/socialLink.js
export const socialLinkSchema = {
  name: 'socialLink',
  title: 'Social Link',
  type: 'document',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'url', title: 'URL', type: 'url' },
    {
      name: 'icon', title: 'Icon', type: 'string',
      options: { list: ['github', 'linkedin', 'instagram', 'substack', 'twitter', 'youtube', 'tiktok', 'discord', 'facebook', 'pinterest', 'twitch', 'email', 'globe'] },
    },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
};

// schemas/contentItem.js
export const contentItemSchema = {
  name: 'contentItem',
  title: 'Content Item',
  type: 'document',
  fields: [
    { name: 'type', title: 'Type', type: 'string', options: { list: ['instagram', 'tiktok'] } },
    { name: 'url', title: 'Post URL', type: 'url' },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'platform', title: 'Platform', type: 'string', options: { list: ['Instagram', 'TikTok'] } },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'dateAdded', title: 'Date Added', type: 'date' },
    { name: 'likes', title: 'Like Count', type: 'number' },
    { name: 'comments', title: 'Comment Count', type: 'number' },
    { name: 'views', title: 'View Count', type: 'number' },
  ],
};

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

// schemas/siteSettings.js
export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'contactEmail', title: 'Contact Email', type: 'string' },
    { name: 'githubIgnoredRepos', title: 'GitHub Repos to Never Auto-import', type: 'array', of: [{ type: 'string' }] },
  ],
};
