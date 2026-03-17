-- Seed data for ClawComp MVP
-- Run this after applying migrations

-- Viral content (OpenClaw YouTube videos)
INSERT INTO viral_content (title, description, embed_url, thumbnail_url, sort_order) VALUES
(
  'OpenClaw Use Cases That Are Actually INSANE (free templates + review)',
  'See how builders are using OpenClaw to automate workflows and ship faster.',
  'https://www.youtube.com/watch?v=yIKxXRks4Jo',
  'https://img.youtube.com/vi/yIKxXRks4Jo/maxresdefault.jpg',
  0
),
(
  'The Ultimate Beginner''s Guide to OpenClaw',
  'Real demos of OpenClaw customizations and agent capabilities.',
  'https://www.youtube.com/watch?v=st534T7-mdE',
  'https://img.youtube.com/vi/st534T7-mdE/maxresdefault.jpg',
  1
),
(
  'OpenClaw is 100x better with this tool (Mission Control)',
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
  'https://cdn.creazilla.com/icons/3242890/github-icon-lg.png',
  'GitHub',
  'The fastest-growing open-source project. Build AI agents that actually do things.'
),
(
  'OpenClaw Saves $4200 on Car Purchase',
  'https://aaronstuyvenberg.com/',
  'https://images.pexels.com/photos/7144243/pexels-photo-7144243.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Blog',
  'AJ Stuyvenberg used OpenClaw to negotiate a car purchase while at work.'
),
(
  'OpenClaw Re-opens Insurance Claim',
  'https://www.linkedin.com/videos/juliangoldieseo_heres-what-happened-lemonade-declined-activity-7431392940641566720-JBxl/',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
  'LinkedIn',
  'Julian Goldie shares how OpenClaw helped win a declined Lemonade claim.'
),
(
  'Overnight Production Bug Fix',
  'https://github.com/openclaw/openclaw',
  'https://images.unsplash.com/photo-1632893037520-7c223d9495f0?w=800&q=80',
  'Story',
  'OpenClaw fixed a production bug overnight without human intervention.'
);
