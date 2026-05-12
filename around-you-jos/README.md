# Around You Jos

A hyperlocal discovery platform for Jos, Plateau State, Nigeria.  
Find trusted local businesses, useful services, and neighborhood guides — built for everyday life in Jos.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL + Prisma ORM |
| CMS | Sanity |
| Hosting | Vercel |

---

## Project Structure
around-you-jos/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Homepage
│   ├── layout.tsx              # Root layout + metadata
│   └── globals.css             # Global styles + Tailwind v4 theme
├── components/
│   ├── layout/                 # Navbar, Footer, Container
│   ├── sections/               # HeroSection, NeighborhoodCards
│   └── ui/                     # Button, Badge
├── lib/
│   └── utils.ts                # cn(), slugify(), formatPhone()
├── prisma/
│   └── schema.prisma           # Database schema
└── sanity/                     # CMS configuration and schemas
---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
```

---

## MVP Features

- [x] Homepage with hero, search, and neighborhood cards
- [ ] Neighborhood pages (Farin Gada, Rayfield, Terminus, and more)
- [ ] Business listing directory
- [ ] Blog and local guides (via Sanity CMS)
- [ ] "Need Something?" request form

---

## Neighborhoods Covered

Farin Gada · Rayfield · Terminus · Bukuru · Anglo Jos · Dogon Dutse

---

## Contributing

This project is in active development. Architecture and features are being built incrementally with a production-quality mindset.