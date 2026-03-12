# ClawComp Website Layout

> Edit this document as we build out the website.

## Home Page (`/`)

- **Hero**: ClawComp branding, tagline, CTA to Apply
- **Viral content section**: Dynamic grid from Supabase `viral_content` table
- **Sponsor scroll wheel**: Horizontal infinite scroll (Link Ventures + placeholders)

## Application Page (`/apply`)

1. **Step 1 — University email verification**: Magic link via Supabase Auth
2. **Step 2 — Basic info**: Name, University, Graduation Year, Email (read-only), Phone, Major, LinkedIn
3. **Step 3 — Team**: Register team (modal) or join via invite code
4. **Step 4 — Application questions**: Links, current project, same project as team?, 3 OpenClaw ideas
5. **Done**: Confirmation

## News/Stories Page (`/news`)

- Card grid of links to OpenClaw articles, anecdotes, GitHub updates
- Thumbnails, source, excerpt
- Links open in new tab

## Tech Stack

- Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- Supabase (Auth, PostgreSQL)
- Framer Motion (scroll animations)
- Vercel deployment
