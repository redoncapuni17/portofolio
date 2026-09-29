-- =============================================================================
-- Optional seed data so the public site has content on first run.
-- Safe to re-run: uses ON CONFLICT on unique keys where available.
-- =============================================================================

-- ---------- site settings --------------------------------------------------
insert into public.site_settings (key, value) values
  ('developer_name',     'Alex Morgan'),
  ('hero_title',         'Full-Stack Software Developer'),
  ('hero_description',   'I build fast, accessible web applications with React, Next.js, Node.js and Python — from first commit to production.'),
  ('email',              'hello@alexmorgan.dev'),
  ('github_url',         'https://github.com/alexmorgan'),
  ('linkedin_url',       'https://linkedin.com/in/alexmorgan'),
  ('location',           'Berlin, Germany'),
  ('availability',       'Available for freelance and full-time roles'),
  ('profile_image',      null),
  ('seo_title',          'Alex Morgan — Full-Stack Software Developer'),
  ('seo_description',    'Portfolio of Alex Morgan, a full-stack developer specialising in React, Next.js, Node.js and Python.'),
  ('years_experience',   '6'),
  ('projects_completed', '30')
on conflict (key) do update set value = excluded.value;

-- ---------- technologies ---------------------------------------------------
insert into public.technologies (name, icon) values
  ('React', 'react'), ('Next.js', 'nextjs'), ('TypeScript', 'typescript'),
  ('Node.js', 'nodejs'), ('Python', 'python'), ('FastAPI', 'fastapi'),
  ('PostgreSQL', 'postgresql'), ('Docker', 'docker'), ('Tailwind CSS', 'tailwind'),
  ('Supabase', 'supabase'), ('Redis', 'redis'), ('React Native', 'react-native'),
  ('GraphQL', 'graphql'), ('Stripe', 'stripe'), ('Django', 'django')
on conflict (name) do nothing;

-- ---------- skills ---------------------------------------------------------
insert into public.skills (name, category, icon, sort_order) values
  ('React',        'frontend', 'react',      1),
  ('Next.js',      'frontend', 'nextjs',     2),
  ('TypeScript',   'frontend', 'typescript', 3),
  ('Tailwind CSS', 'frontend', 'tailwind',   4),
  ('Node.js',      'backend',  'nodejs',     1),
  ('Python',       'backend',  'python',     2),
  ('FastAPI',      'backend',  'fastapi',    3),
  ('PostgreSQL',   'backend',  'postgresql', 4),
  ('Docker',       'tools',    'docker',     1),
  ('Git & GitHub', 'tools',    'git',        2),
  ('Vercel',       'tools',    'vercel',     3),
  ('Figma',        'tools',    'figma',      4);

-- ---------- experience -----------------------------------------------------
insert into public.experience (position, company, location, start_date, end_date, currently_working, description, type, sort_order) values
  ('Senior Full-Stack Developer', 'Finlayer', 'Berlin, Germany', '2023-03-01', null, true,
   'Lead developer on a fintech dashboard used by 40k customers. Own the Next.js frontend and Node.js API, mentor two junior engineers.', 'work', 1),
  ('Software Engineer', 'Shopwave', 'Remote', '2020-06-01', '2023-02-28', false,
   'Built a headless e-commerce storefront and checkout flow that lifted conversion by 18%.', 'work', 2),
  ('Frontend Developer', 'Nordic Digital', 'Copenhagen, Denmark', '2018-09-01', '2020-05-31', false,
   'Delivered marketing sites and design systems for agency clients using React and TypeScript.', 'work', 3),
  ('B.Sc. Computer Science', 'Technical University of Berlin', 'Berlin, Germany', '2014-10-01', '2018-07-31', false,
   'Focus on distributed systems and human–computer interaction.', 'education', 1);

-- ---------- services -------------------------------------------------------
insert into public.services (title, description, icon, technologies, sort_order) values
  ('Web Development',
   'Responsive, accessible web applications built with React, Next.js and TypeScript, optimised for speed and SEO.',
   'globe', array['React','Next.js','TypeScript','Tailwind CSS'], 1),
  ('API Development',
   'Secure, well-documented REST and GraphQL APIs using Node.js and Python, with automated tests and CI/CD.',
   'server', array['Node.js','Python','FastAPI','PostgreSQL'], 2),
  ('Mobile Apps',
   'Cross-platform iOS and Android apps with React Native that share logic with your web product.',
   'smartphone', array['React Native','Expo','TypeScript'], 3);

-- ---------- testimonials ---------------------------------------------------
insert into public.testimonials (name, position, company, quote, rating, sort_order) values
  ('Sarah Lindqvist', 'Head of Product', 'Shopwave',
   'Alex rebuilt our checkout flow in six weeks and conversion went up 18%. Clear communication, zero surprises.', 5, 1),
  ('David Okafor', 'CTO', 'Finlayer',
   'The API Alex designed has handled every traffic spike we have thrown at it. It is the most stable part of our stack.', 5, 2),
  ('Maria González', 'Founder', 'Meetly',
   'Rare mix of strong engineering and genuine care for the user experience. We would hire him again in a heartbeat.', 5, 3);

-- ---------- projects -------------------------------------------------------
insert into public.projects (title, slug, short_description, description, problem, solution, results, role, timeline, project_type, live_url, github_url, key_features, featured, published, sort_order) values
  ('Ledgerly', 'ledgerly',
   'Personal finance dashboard with real-time budgeting insights.',
   'Ledgerly aggregates bank accounts, categorises transactions automatically and shows people exactly where their money goes.',
   'Users tracked spending across several bank apps and spreadsheets and had no single, trustworthy view of their finances.',
   'Built a React and Node.js dashboard that syncs accounts, categorises transactions automatically and surfaces budgeting insights in real time.',
   '40k active users in the first year, 35% faster load time after a rendering refactor, and a 4.8-star average rating.',
   'Lead Full-Stack Developer', '6 months', 'Web Application',
   'https://example.com/ledgerly', 'https://github.com/alexmorgan/ledgerly',
   array['Bank account sync','Automatic categorisation','Monthly budgets and alerts','Exportable reports'],
   true, true, 1),
  ('Shopwave Storefront', 'shopwave-storefront',
   'Headless e-commerce storefront with sub-second page loads.',
   'A Next.js storefront powered by a headless commerce API, with server-side rendering and edge caching.',
   'The legacy storefront took over four seconds to load on mobile and conversion was falling.',
   'Rebuilt the storefront with Next.js, streaming and image optimisation, plus a redesigned one-page checkout.',
   'Largest Contentful Paint under one second and an 18% lift in checkout conversion.',
   'Frontend Lead', '4 months', 'E-commerce',
   'https://example.com/shopwave', 'https://github.com/alexmorgan/shopwave',
   array['Server-side rendering','One-page checkout','Stripe payments','Product search'],
   true, true, 2),
  ('DevPulse API', 'devpulse-api',
   'Public REST API aggregating developer productivity metrics.',
   'A FastAPI service that aggregates GitHub, Jira and CI data into a single metrics API.',
   'Engineering managers stitched together spreadsheets from several tools to report on team health.',
   'Designed a FastAPI service with Redis caching and background workers that normalises data from every source.',
   'Handles 2M requests per day with p95 latency under 120ms.',
   'Backend Developer', '3 months', 'API',
   null, 'https://github.com/alexmorgan/devpulse',
   array['OAuth integrations','Redis caching','Webhook ingestion','OpenAPI docs'],
   false, true, 3)
on conflict (slug) do nothing;

-- Link technologies to projects
insert into public.project_technologies (project_id, technology_id)
select p.id, t.id
from public.projects p
join public.technologies t on t.name = any (
  case p.slug
    when 'ledgerly'            then array['React','Node.js','PostgreSQL','TypeScript']
    when 'shopwave-storefront' then array['Next.js','TypeScript','Stripe','Tailwind CSS']
    when 'devpulse-api'        then array['Python','FastAPI','Redis','Docker']
    else array[]::text[]
  end
)
on conflict (project_id, technology_id) do nothing;

-- ---------- blog posts -----------------------------------------------------
insert into public.blog_posts (title, slug, excerpt, content, category, author, published, published_at) values
  ('Cutting our Next.js bundle size by 40%', 'cutting-nextjs-bundle-size',
   'A step-by-step look at how tree-shaking, dynamic imports and a font audit shaved seconds off first load.',
   E'Performance work rarely comes from one big change. It comes from measuring, fixing the largest offender, and repeating.\n\n## Measure first\n\nWe started with the Next.js bundle analyser and Lighthouse. Two icon libraries and an unused date library accounted for a third of the client bundle.\n\n## Dynamic imports\n\nModals, charts and the rich text editor were moved behind `next/dynamic` so they only load when needed.\n\n## Fonts\n\nSelf-hosting a single variable font with `next/font` removed two network round trips.\n\nThe result: 40% smaller bundle and a Largest Contentful Paint improvement of 1.2 seconds on mobile.',
   'Performance', 'Alex Morgan', true, now() - interval '10 days'),
  ('When a monolith is the right call', 'when-a-monolith-is-the-right-call',
   'Microservices are not free. Here is how I decide when a well-structured monolith wins.',
   E'Every architecture decision is a trade-off between speed of change today and flexibility tomorrow.\n\n## Start with the team\n\nA team of three does not need twelve deployables. A modular monolith with clear boundaries gives you most of the benefits with a fraction of the operational cost.\n\n## Extract when it hurts\n\nWhen one module needs a different scaling profile, release cadence or language, that is your signal to extract it.\n\nUntil then, keep it simple.',
   'Architecture', 'Alex Morgan', true, now() - interval '30 days')
on conflict (slug) do nothing;
