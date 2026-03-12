-- Seed data for ClawComp MVP
-- Run this after applying migrations

-- Viral content (from 6-pager references)
INSERT INTO viral_content (title, description, embed_url, thumbnail_url, sort_order) VALUES
(
  'OpenClaw Style Content Example',
  'High-energy shorts showcasing OpenClaw customizations and builder workflows.',
  'https://www.youtube.com/watch?v=IFeaaGsflKU',
  'https://img.youtube.com/vi/IFeaaGsflKU/maxresdefault.jpg',
  0
),
(
  'OpenClaw Saves $4200 on Car Purchase',
  'AJ Stuyvenberg used OpenClaw to save thousands while at work.',
  'https://aaronstuyvenberg.com/',
  NULL,
  1
),
(
  'OpenClaw Re-opens Insurance Claim and Wins',
  'Julian Goldie shares how OpenClaw helped win a Lemonade claim.',
  'https://www.linkedin.com/videos/juliangoldieseo_heres-what-happened-lemonade-declined-activity-7431392940641566720-JBxl/',
  NULL,
  2
);

-- News items
INSERT INTO news_items (title, url, thumbnail_url, source, excerpt) VALUES
(
  'OpenClaw GitHub',
  'https://github.com/openclaw/openclaw',
  'https://github.githubassets.com/assets/open-graph-default.png',
  'GitHub',
  'The fastest-growing open-source project. Build AI agents that actually do things.'
),
(
  'OpenClaw Saves $4200 on Car Purchase',
  'https://aaronstuyvenberg.com/',
  NULL,
  'Blog',
  'AJ Stuyvenberg used OpenClaw to negotiate a car purchase while at work.'
),
(
  'OpenClaw Re-opens Insurance Claim',
  'https://www.linkedin.com/videos/juliangoldieseo_heres-what-happened-lemonade-declined-activity-7431392940641566720-JBxl/',
  NULL,
  'LinkedIn',
  'Julian Goldie shares how OpenClaw helped win a declined Lemonade claim.'
),
(
  'Overnight Production Bug Fix',
  'https://github.com/openclaw/openclaw',
  NULL,
  'Story',
  'OpenClaw fixed a production bug overnight without human intervention.'
);
