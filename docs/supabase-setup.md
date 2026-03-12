# Supabase Setup Guide for ClawComp

## Step 1: Get Your Project Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create one)
3. Go to **Settings** → **API** in the left sidebar
4. Copy:
   - **Project URL** (e.g. `https://jxfuhkswpfqnawrpvbfi.supabase.co`)
   - **anon public** key (under "Project API keys")

---

## Step 2: Run the Database Migration (SQL Editor)

Since the Supabase CLI isn't required, run the migration directly in the dashboard:

1. In your Supabase project, go to **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy the entire contents of `supabase/migrations/20250312000000_initial_schema.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Cmd+Enter)
6. You should see "Success. No rows returned" — that means the tables were created

---

## Step 3: Seed Sample Data (Optional)

1. In the SQL Editor, click **New query** again
2. Copy the entire contents of `supabase/seed.sql`
3. Paste and click **Run**
4. This adds sample viral content and news items for the home page

---

## Step 4: Enable Email (Magic Link) Auth

1. Go to **Authentication** → **Providers** in the left sidebar
2. Find **Email** and ensure it's enabled
3. Under **Email**, enable **Confirm email** if you want users to verify before signing in (recommended)
4. Go to **Authentication** → **URL Configuration**
5. Add your **Site URL**:
   - Local: `http://localhost:3000`
   - Production: `https://your-vercel-domain.vercel.app`
6. Add **Redirect URLs**:
   - `http://localhost:3000/**`
   - `https://your-vercel-domain.vercel.app/**`

---

## Step 5: Add Environment Variables

Create or update `.env.local` in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual values from Step 1.

**Important:** Restart your dev server (`npm run dev`) after adding or changing `.env.local` — Next.js only loads env vars at startup.

---

## Step 6: Verify

1. Run `npm run dev` locally
2. Visit http://localhost:3000
3. The home page should load viral content and news from Supabase
4. Try the Apply flow — you should receive a magic link at your university email
