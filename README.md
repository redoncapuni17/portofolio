# Developer Portfolio

A production-ready personal portfolio for a software developer with a private admin panel for managing every piece of content.

- **Public site:** Home, About, Projects (+ detail pages), Services, Testimonials, Blog (+ posts), Contact
- **Admin panel:** `/admin` — projects, blog posts, skills, experience, services, testimonials, contact inbox and site settings, with image uploads and publish/unpublish controls
- **Stack:** Next.js 16 (App Router, Server Components, Server Actions), TypeScript, Tailwind CSS v4, Supabase (Postgres, Auth, Storage, Row Level Security), React Hook Form + Zod, Lucide icons, deployed on Vercel

```
Browser  ──►  Next.js (Vercel)  ──►  Supabase (Postgres · Auth · Storage)
```

---

## Table of contents

1. [Requirements](#1-requirements)
2. [Installation](#2-installation)
3. [Supabase setup](#3-supabase-setup)
4. [Environment variables](#4-environment-variables)
5. [Local development](#5-local-development)
6. [Deployment on Vercel](#6-deployment-on-vercel)
7. [Project structure](#7-project-structure)
8. [Security model](#8-security-model)
9. [Content management](#9-content-management)
10. [Scripts](#10-scripts)

---

## 1. Requirements

- **Node.js 20+** (Node 24 recommended) — _or_ **Docker** if you cannot install Node locally (see [Local development](#5-local-development))
- A free [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account for deployment (optional)

## 2. Installation

```bash
git clone <your-repo-url> portfolio
cd portfolio
npm install
cp .env.example .env.local   # then fill in the values (see below)
```

## 3. Supabase setup

### 3.1 Create the project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Choose a strong database password and the region closest to your visitors.
3. Wait until the project has finished provisioning.

### 3.2 Run the database migrations

Open **SQL Editor** in the Supabase dashboard and run the files below **in this order** (paste each file's contents and click **Run**):

| Order | File | What it does |
|------:|------|--------------|
| 1 | `supabase/migrations/20260929000001_schema.sql` | Tables, enums, indexes, `updated_at` triggers, `profiles` auto-creation trigger and the `is_admin()` helper |
| 2 | `supabase/migrations/20260929000002_rls.sql` | Row Level Security policies for every table |
| 3 | `supabase/migrations/20260929000003_storage.sql` | Storage buckets (`profile`, `projects`, `blog`, `testimonials`) and their access policies |
| 4 | `supabase/seed.sql` *(optional)* | Sample content so the site is not empty on first run — edit or delete it later from the admin panel |

> Using the Supabase CLI instead? `supabase link --project-ref <ref>` then `supabase db push` applies the migrations, and `supabase db seed` (or running `seed.sql` manually) loads the sample content.

### 3.3 Disable public sign-ups

The portfolio has exactly one kind of user: **you, the admin**. There is no public registration page, and the database only allows the `admin` role, so make sure nobody can sign themselves up:

1. **Authentication → Sign In / Providers → Email**: keep *Email* enabled, **turn off "Allow new users to sign up"**.
2. (Recommended) turn off *Confirm email* for a simpler first login, or keep it on and confirm the address you add in the next step.

### 3.4 Create your admin user

1. **Authentication → Users → Add user → Create new user**.
2. Enter your email and a strong password, tick **Auto Confirm User**, and create it.
3. The `on_auth_user_created` trigger automatically inserts a matching row in `public.profiles` with `role = 'admin'`.

You can now sign in at `/admin/login` with that email and password.

### 3.5 Copy the API keys

**Project Settings → API**: copy the **Project URL** and the **anon public** key into `.env.local` (next section).

> The **service_role** key is **not** used anywhere in this project and must never be added to any `NEXT_PUBLIC_*` variable or committed to git. All privileged access is handled by Row Level Security and the signed-in admin's session.

## 4. Environment variables

Create `.env.local` (it is git-ignored) from `.env.example`:

| Variable | Required | Description |
|----------|:--------:|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase **Project URL**, e.g. `https://abcdefgh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase **anon public** key. Safe for the browser — every request is still subject to RLS |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL used for metadata, Open Graph, `sitemap.xml` and `robots.txt`. `http://localhost:3000` locally, your production domain on Vercel. If omitted on Vercel the deployment URL is used |

Never commit `.env.local`. The `.gitignore` already excludes every `.env*` file except `.env.example`.

## 5. Local development

### Option A — Node installed locally

```bash
npm run dev
```

Open <http://localhost:3000>. The admin panel lives at <http://localhost:3000/admin>.

### Option B — Docker (no local Node required)

The repo ships a `docker-compose.yml` that runs the dev server inside the official `node:24-alpine` image with your project folder mounted, so file changes hot-reload as usual.

```bash
docker compose up
```

The first start runs `npm install` inside the container; subsequent starts are fast. Stop with `Ctrl+C` or `docker compose down`.

One-off commands (build, lint, type-check, installing a package) can be run the same way:

```bash
# PowerShell
docker run --rm -v "${PWD}:/app" -w /app node:24-alpine sh -c "npm run build"
docker run --rm -v "${PWD}:/app" -w /app node:24-alpine sh -c "npm run lint"
docker run --rm -v "${PWD}:/app" -w /app node:24-alpine sh -c "npm install some-package"

# bash / zsh
docker run --rm -v "$PWD:/app" -w /app node:24-alpine sh -c "npm run build"
```

### Verifying a change

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # full production build
```

## 6. Deployment on Vercel

1. Push the repository to GitHub (or GitLab/Bitbucket).
2. In Vercel click **Add New → Project**, import the repository and keep the detected **Next.js** preset.
3. Under **Environment Variables** add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → your production URL, e.g. `https://yourname.dev`
4. Click **Deploy**.
5. In Supabase, go to **Authentication → URL Configuration** and set **Site URL** to your production URL (and add the Vercel preview pattern `https://*-yourteam.vercel.app/**` to *Redirect URLs* if you use preview deployments).

Every push to the main branch triggers a new deployment. Public pages are statically generated and revalidated every 5 minutes, and every admin save calls `revalidatePath`, so content changes show up immediately.

## 7. Project structure

```
src/
├── app/
│   ├── (public)/              # Public pages sharing Navbar + Footer
│   │   ├── page.tsx           # Home
│   │   ├── about/  projects/  projects/[slug]/  services/
│   │   ├── testimonials/  blog/  blog/[slug]/  contact/
│   │   ├── loading.tsx  error.tsx  layout.tsx
│   ├── admin/
│   │   ├── login/             # Sign-in page (outside the protected layout)
│   │   └── (dashboard)/       # Protected by requireAdmin() in layout.tsx
│   │       ├── page.tsx       # Dashboard
│   │       ├── projects/  projects/new/  projects/[id]/edit/
│   │       ├── blog/  blog/new/  blog/[id]/edit/
│   │       ├── skills/  experience/  services/  testimonials/
│   │       ├── messages/  settings/
│   ├── auth/signout/route.ts  # POST → signs out and redirects to /admin/login
│   ├── layout.tsx  globals.css  not-found.tsx  sitemap.ts  robots.ts
├── components/
│   ├── ui/                    # Button, Card, Badge, form primitives, Icon, …
│   ├── layout/                # Navbar, Footer
│   ├── home/ about/ projects/ services/ testimonials/ blog/ contact/
│   └── admin/                 # Sidebar, tables, forms, image upload, toggles
├── lib/
│   ├── supabase/              # client.ts (browser), server.ts (cookies), public.ts (anon), proxy.ts
│   ├── queries/               # Read-only data access, separated from presentation
│   ├── actions/               # Server Actions (auth, CRUD, uploads, settings)
│   ├── validations/           # Zod schemas shared by client forms and server actions
│   ├── storage/               # Browser-side upload helper for Supabase Storage
│   ├── auth.ts                # getCurrentUser(), requireAdmin()
│   └── utils/                 # cn, formatting, slugify, site URL helpers
├── types/                     # Database types and shared app types
└── proxy.ts                   # Refreshes the Supabase session and guards /admin/*
supabase/
├── migrations/                # schema → RLS → storage
└── seed.sql                   # Optional sample data
```

## 8. Security model

- **No service-role key.** The app only ever uses the public anon key. Everything the admin can do is granted by RLS policies that check `public.is_admin()`, which requires an authenticated session whose `profiles.role = 'admin'`.
- **Server-side route protection.** `src/proxy.ts` refreshes the session cookie on every request and redirects unauthenticated visitors from `/admin/*` to `/admin/login`. Additionally, the admin layout and **every server action** call `requireAdmin()`, so protection does not depend on the client.
- **Validation on both sides.** Forms validate with React Hook Form + Zod in the browser for fast feedback; the same Zod schemas run again inside the server actions before anything touches the database.
- **Contact form.** Anonymous visitors can only `INSERT` into `contact_messages` (and only with `read = false`); reading, updating and deleting requires the admin. A honeypot field silently drops basic bots.
- **Storage.** Buckets are public-read (needed for images on the site) but only the admin can upload, replace or delete objects. Uploads are limited by size and MIME type at the bucket level.
- **Secrets.** `.env.local` is git-ignored. Only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SITE_URL` exist.

## 9. Content management

Sign in at `/admin/login`, then:

| Section | What you can do |
|---------|-----------------|
| **Dashboard** | Counts of projects, posts, testimonials and unread messages; latest messages |
| **Projects** | Create/edit/delete, cover image, multiple screenshots with captions, technologies picker (add new ones inline), problem/solution/results, key features, featured & published toggles |
| **Blog** | Create/edit/delete posts, cover image, category, author, scheduled publish date, publish toggle |
| **Skills** | Grouped by Frontend / Backend / Tools, optional icon, ordering, publish toggle |
| **Experience** | Work and education timeline entries with date ranges and "currently here" |
| **Services** | Title, description, icon, technology tags, ordering |
| **Testimonials** | Client name, role, company, quote, rating, photo |
| **Messages** | Read contact form submissions, mark read/unread, reply by email, delete |
| **Settings** | Name, hero text, profile photo, location, availability, email, GitHub/LinkedIn, stats, SEO title/description |

Destructive actions ask for confirmation. Deleting a record also removes its uploaded images from Storage.

Icons for skills and services are looked up by name in `src/components/ui/icon.tsx`; add new keys there to extend the set.

## 10. Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |

---

Built with Next.js, Supabase and Tailwind CSS. Released under the MIT licence — replace the content, keep the code.
