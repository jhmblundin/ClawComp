-- Seed data for ClawComp MVP
-- Run this after applying migrations

-- Viral content (OpenClaw YouTube videos)
INSERT INTO viral_content (title, description, embed_url, thumbnail_url, sort_order) VALUES
(
  'OpenClaw in Action',
  'See how builders are using OpenClaw to automate workflows and ship faster.',
  'https://www.youtube.com/watch?v=yIKxXRks4Jo',
  'https://img.youtube.com/vi/yIKxXRks4Jo/maxresdefault.jpg',
  0
),
(
  'What OpenClaw Can Do',
  'Real demos of OpenClaw customizations and agent capabilities.',
  'https://www.youtube.com/watch?v=st534T7-mdE',
  'https://img.youtube.com/vi/st534T7-mdE/maxresdefault.jpg',
  1
),
(
  'OpenClaw Stories from the Community',
  'Builders share their OpenClaw setups and breakthrough moments.',
  'https://www.youtube.com/watch?v=RhLpV6QDBFE',
  'https://img.youtube.com/vi/RhLpV6QDBFE/maxresdefault.jpg',
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
