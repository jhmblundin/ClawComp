# ClawComp — OpenClaw Builder Challenge

University students compete to build the most revolutionary OpenClaw setups. Hosted by Link Ventures.

## Tech Stack

- **Next.js 14+** (App Router), React, TypeScript
- **Tailwind CSS** for styling
- **Supabase** for auth (magic link) and database
- **Framer Motion** for scroll animations
- **Vercel** for deployment

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migrations in `supabase/migrations/` via the SQL Editor or Supabase CLI
3. Optionally run `supabase/seed.sql` for sample viral content and news
4. Enable **Email (Magic Link)** in Authentication > Providers
5. Add your site URL to Authentication > URL Configuration (e.g. `http://localhost:3000` for dev)

### 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Logos

Add your logo files to `public/logos/`:

- `link-ventures.svg` — Link Ventures logo
- `openclaw.svg` — OpenClaw logo
- `sponsors/` — Sponsor logos (Link Ventures + others)

Placeholder SVGs are included for development.

### 5. Run locally

```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel project settings
4. Add your production URL to Supabase Authentication > URL Configuration

## Pages

- **/** — Home: Hero, viral content, sponsor wheel
- **/apply** — Application: email verification, basic info, team (invite code), questions
- **/news** — OpenClaw news and stories

## Database

- `teams` — Teams with invite codes (max 3 members)
- `applications` — Applicant data linked to auth users
- `viral_content` — Admin-curated videos for home page
- `news_items` — News/stories with thumbnails and links

Add content via Supabase Dashboard or SQL.
