A hyperlocal discovery platform for Jos, Plateau State, Nigeria.
Find trusted local businesses, useful services, and neighborhood guides — built for everyday life in Jos.

**Live:** https://around-you-jos.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 |
| CMS | Sanity |
| Hosting | Vercel |

---

## Project Structure
around-you-jos/
├── app/
│   ├── page.tsx                        # Homepage
│   ├── layout.tsx                      # Root layout + metadata
│   ├── globals.css                     # Global styles + Tailwind v4 theme
│   ├── blog/
│   │   ├── page.tsx                    # Blog listing
│   │   └── [slug]/page.tsx             # Blog post detail
│   ├── businesses/
│   │   ├── page.tsx                    # Business listing
│   │   └── [slug]/page.tsx             # Business detail
│   ├── neighborhoods/
│   │   ├── page.tsx                    # Neighborhoods list
│   │   └── [slug]/page.tsx             # Neighborhood detail
│   ├── search/
│   │   └── page.tsx                    # Search results
│   ├── ask/
│   │   ├── page.tsx                    # Request form
│   │   └── actions.ts                  # Server action
│   └── studio/[[...tool]]/
│       └── page.tsx                    # Sanity Studio
├── components/
│   ├── layout/                         # Navbar, Footer, Container
│   ├── sections/                       # HeroSection, NeighborhoodCards, PostsList, StatBar
│   ├── business/                       # BusinessCard
│   ├── ui/                             # Button, Badge, ThemeToggle
│   └── providers/                      # ThemeProvider
├── lib/
│   ├── data/                           # Database query functions
│   ├── services/                       # Business logic layer
│   ├── validations/                    # Zod schemas
│   ├── prisma.ts                       # Prisma client singleton
│   └── utils.ts                        # cn(), slugify(), formatPhone()
├── sanity/
│   ├── schemas/                        # Content schemas
│   ├── client.ts                       # Sanity client + fetch helper
│   ├── queries.ts                      # GROQ queries
│   └── sanity.config.ts                # Studio configuration
├── prisma/
│   ├── schema.prisma                   # Database schema
│   └── seed.ts                         # Seed data
└── types/
└── index.ts                        # Shared TypeScript types

---

## Getting Started

```bash
# Install dependencies
npm install

# Start local PostgreSQL (Codespaces)
sudo service postgresql start

# Push database schema
npx prisma db push

# Seed the database
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
Open [http://localhost:3000/studio](http://localhost:3000/studio) for the CMS.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SANITY_PROJECT_ID="h824w66c"
NEXT_PUBLIC_SANITY_DATASET="production"
```

---

## Architecture
Pages (Server Components)
↓
Data Layer (lib/data/)
↓
Service Layer (lib/services/)
↓
Prisma ORM
↓
PostgreSQL (Neon)
Sanity CMS → GROQ queries → Blog pages
Server Actions → Zod validation → Service layer → Database

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage with sidebar, search, real data |
| `/businesses` | All businesses with filter sidebar |
| `/businesses/[slug]` | Business detail with contact info |
| `/neighborhoods` | All neighborhoods |
| `/neighborhoods/[slug]` | Neighborhood with filtered businesses |
| `/blog` | Blog listing from Sanity CMS |
| `/blog/[slug]` | Blog post detail |
| `/search` | Full-text search results |
| `/ask` | "Need Something?" request form |
| `/studio` | Sanity Studio for content editors |

---

## MVP Features

- [x] Homepage with utilitarian layout and real data
- [x] Business listing and detail pages
- [x] Neighborhood pages with filtered businesses
- [x] Full-text search
- [x] Blog and local guides via Sanity CMS
- [x] "Need Something?" request form
- [x] Dark/light/system theme
- [x] Production deployment on Vercel
- [ ] Business submission form
- [ ] Admin dashboard
- [ ] GitHub → Vercel auto-deploy
- [ ] Sitemap and structured data

---

## Important Notes

- Local PostgreSQL resets on Codespace rebuild — run `sudo service postgresql start` before `npm run dev`
- Sanity Studio is at `/studio` — add localhost to CORS in Sanity dashboard for local development
- Prisma 7 uses `prisma.config.ts` for database config — not `schema.prisma`
- Tailwind v4 configured in `globals.css` via `@theme` — no `tailwind.config.ts`

---

## Neighborhoods Covered

Farin Gada · Rayfield · Terminus · Bukuru · Anglo Jos · Dogon Dutse · Tudun Wada
