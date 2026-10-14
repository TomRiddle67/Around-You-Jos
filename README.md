# Around You Jos

> A community-powered local discovery platform for Jos, Plateau State, Nigeria.

Around You Jos helps residents, newcomers, and visitors discover trusted local businesses, everyday neighborhood services, and local guides across Jos.

---

## The Problem It Solves

In Jos, vital local information—such as finding a reliable tailor in Millionaires Quarters, a skilled mechanic in Anglo Jos, an open pharmacy in Rayfield, or a dependable printing press—is often fragmented across word-of-mouth recommendations, social media groups, or physical trial and error.

Around You Jos organizes local knowledge into a fast, accessible, and structured directory so that anyone can quickly find verified places, neighborhood services, and direct contact details.

---

## Current Features (Implemented)

All features below are implemented, tested, and actively running:

- **Business Discovery & Filtering:** Browse local businesses categorized by sector (pharmacies, auto repair, tailoring, printing, tech repair, restaurants, supermarkets) with neighborhood filters, addresses, and direct phone/WhatsApp contact links.
- **Neighborhood Browsing:** Explore dedicated guides for Jos neighborhoods (e.g., Millionaires Quarters, Rayfield, Tudun Wada, Anglo Jos, Terminus) to find services closest to home or work.
- **Business Detail Pages:** Dedicated business profiles displaying verified status, operational details, category badges, and neighborhood context.
- **Safe Full-Text Search:** Real-time search across business names, descriptions, categories, and neighborhoods, hardened with strict boundary protection (100-character query limit, whitespace normalization, and database query bypass on invalid queries).
- **"Need Something?" Service Requests:** A direct request workflow validated by strict Zod schemas, allowing visitors to request help finding specialized local providers.
- **Editorial Blog & Local Guides:** Sanity CMS integration designed with graceful fallback handling so the application operates seamlessly even before CMS credentials are configured.
- **HTTP Security Protections:** Hardened baseline security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`).
- **Dark & Light Mode:** Built-in theme toggling powered by `next-themes` and Tailwind CSS design tokens.

---

## Planned Features (Roadmap)

The following capabilities represent our long-term vision and are **not yet implemented**:

- [ ] **Community Business Submissions:** Direct web form allowing local business owners and residents to suggest new listings or updates.
- [ ] **Business Verification & Owner Claims:** Dedicated claim and authentication workflow for business owners to manage their profiles.
- [ ] **Community Recommendations & Reviews:** Resident tips and authentic community reviews celebrating standout local artisans and spots.
- [ ] **Expanded Neighborhood Coverage:** Complete directory expansion across all districts of the Jos-Bukuru metropolis.

---

## Technology Stack

The application is built with a modern, type-safe stack:

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16.2.6 | App Router, Server Components, Turbopack |
| **UI Library** | React 19.2.4 | Modern concurrent React |
| **Language** | TypeScript 5 | Strict type safety across application and data layer |
| **Styling** | Tailwind CSS v4 | Configured via `@theme` tokens in `app/globals.css` |
| **Database** | PostgreSQL | Supported locally via PostgreSQL/Docker and cloud via Neon |
| **ORM** | Prisma 7.8.0 | Uses `@prisma/adapter-pg` driver adapter and `pg` 8.20.0 |
| **Validation** | Zod 4.4.3 | Strict request and input validation |
| **Content Management** | Sanity CMS 5.24.0 | Embedded Studio at `/studio` with `@sanity/client` 7.22.0 |
| **Testing** | Vitest 3.2.7 | Fast unit and integration tests with mock isolation |
| **Icons** | Lucide React 1.14.0 | Accessible UI icons |

---

## Prerequisites

Before setting up the project locally, ensure you have:

- **Node.js** (v20 or higher recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (running locally, via Docker container, or a free cloud instance such as Neon)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TomRiddle67/Around-You-Jos.git
cd Around-You-Jos/around-you-jos
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the template to create your local environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/around_you_jos?schema=public"

# Optional: Sanity CMS configuration
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
```

> **Security Note:** Never commit `.env.local` or real database passwords to version control. The `.env.local` file is already listed in `.gitignore`.

### 4. Push database schema

Push the Prisma schema to your PostgreSQL database:

```bash
npx prisma db push
```

### 5. Seed the database

Populate the database with sample Jos neighborhoods, categories, and businesses:

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.  
To access the embedded Sanity Studio, visit [http://localhost:3000/studio](http://localhost:3000/studio).

---

## Automated Verification

The repository includes comprehensive automated tests and type checks:

```bash
# Run unit and integration tests
npm test

# Run TypeScript type check
npx tsc --noEmit

# Run ESLint
npm run lint
```

---

## Project Structure

```text
Around-You-Jos/
├── README.md                           # Repository documentation
└── around-you-jos/                     # Next.js web application
    ├── app/                            # Next.js App Router
    │   ├── page.tsx                    # Homepage
    │   ├── layout.tsx                  # Root layout & global metadata
    │   ├── globals.css                 # Global CSS & Tailwind v4 theme
    │   ├── about/                      # About page (/about)
    │   ├── ask/                        # "Need Something?" request form (/ask)
    │   ├── blog/                       # Editorial guides and articles (/blog)
    │   ├── businesses/                 # Business listing and detail pages (/businesses)
    │   ├── neighborhoods/              # Neighborhood guides (/neighborhoods)
    │   ├── search/                     # Search page with boundary protection (/search)
    │   └── studio/                     # Embedded Sanity Studio (/studio)
    ├── components/                     # Reusable React components
    │   ├── layout/                     # Navbar, Footer, Container
    │   ├── business/                   # Business cards and badges
    │   ├── sections/                   # HeroSection, StatBar, AskForm
    │   └── ui/                         # ThemeToggle and UI primitives
    ├── lib/                            # Application logic and database queries
    │   ├── data/                       # Prisma queries (businesses, neighborhoods)
    │   ├── validations/                # Zod schemas (service requests)
    │   ├── prisma.ts                   # Prisma client singleton
    │   └── utils.ts                    # Class name and formatting helpers
    ├── sanity/                         # Sanity CMS configuration & queries
    ├── prisma/                         # Prisma schema and seed data
    │   ├── schema.prisma               # Database schema definition
    │   └── seed.ts                     # Seed script
    ├── __tests__/                      # Automated Vitest test suite
    │   ├── data/                       # Query filtering & search protection tests
    │   ├── validations/                # Service request validation tests
    │   ├── security/                   # HTTP security header tests
    │   └── sanity/                     # Resilient CMS client tests
    ├── next.config.ts                  # Next.js configuration & security headers
    └── package.json                    # Project scripts and dependencies
```

---

## Security & Privacy Guidelines

- **Local Development Data:** Do not enter real personal phone numbers or sensitive information into a local development database.
- **Credentials:** Never commit `.env.local`, API tokens, or database credentials.
- **Responsible Disclosure:** If you discover a security concern or potential vulnerability, please report it responsibly by contacting the maintainers directly.

---

## Current Setup Limitations

- **Sanity CMS Content:** The blog is fully integrated with Sanity; if `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset, the blog displays a graceful empty state without crashing. To publish live blog posts, configure a valid Sanity project and dataset and add `http://localhost:3000` to your Sanity project's CORS origins.
- **Seed Data:** The database currently seeds curated demonstration businesses in Millionaires Quarters for testing purposes. Real directory expansion is ongoing.

---

## Contributing

We welcome contributions, bug fixes, and suggestions!

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make focused, well-tested changes adhering to existing TypeScript and Tailwind conventions.
3. Verify that tests, typechecking, and linting all pass:
   ```bash
   npm test && npx tsc --noEmit && npm run lint
   ```
4. Submit a clear, descriptive Pull Request.
