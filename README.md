# DevRel OS

A personal CRM and command center for Developer Relations professionals. Track opportunities, articles, open-source contributions, community involvement, weekly reviews, goals, and notes — all in one place.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org/) 16.2.9 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com/) (Base Nova) |
| Primitives | [@base-ui/react](https://base-ui.com/) 1.5 |
| Database | SQLite via [Prisma](https://www.prisma.io/) 7 + `@prisma/adapter-libsql` |
| Validation | [Zod](https://zod.dev/) 4 |
| Toasts | [Sonner](https://sonner.emilkowal.ski/) |
| Icons | [Lucide React](https://lucide.dev/) |

## Features

### Dashboard
- Aggregated metrics: total opportunities, active applications, published articles, contributions, communities
- Opportunities needing attention board
- Quick-link navigation to all modules

### Opportunities Tracker
- Full CRUD with server actions and Zod validation
- Table with search, category, and status filters
- Sortable columns

### Articles Tracker
- Full CRUD with server actions and Zod validation
- Table view with search, platform, and status filters
- Kanban board with Idea / Draft / Editing / Published columns

### Open Source Tracker
- Full CRUD with server actions and Zod validation
- Table with search, type, and status filters

### Community Tracker
- Full CRUD with server actions and Zod validation
- Grid view and table view toggle
- Search filter

### Weekly Review
- Create and edit weekly reflections
- Five-section format: Learned, Built, Wrote, Contributed, Reflection
- Archive list with expandable entries

### Goals Tracker
- Progress bars with gradient styling
- Inline progress editing
- Create and delete goals

### Notes Editor
- Split-pane layout: sidebar note list + main editor
- Markdown support
- Category selector (Article Draft, Opportunity Notes, Learning, General)
- Dirty-state save tracking

## Project Structure

```
.
├── prisma/
│   ├── schema.prisma              # 7-model database schema
│   ├── seed.ts                    # Seed data for all models
│   └── migrations/                # SQLite migrations
├── src/
│   ├── actions/                   # Server actions (CRUD per model)
│   │   ├── article.ts
│   │   ├── community.ts
│   │   ├── contribution.ts
│   │   ├── goal.ts
│   │   ├── note.ts
│   │   ├── opportunity.ts
│   │   └── review.ts
│   ├── app/                       # Next.js App Router pages
│   │   ├── page.tsx               # Dashboard (aggregated metrics)
│   │   ├── loading.tsx            # Loading skeleton
│   │   ├── layout.tsx             # Root layout (dark mode, fonts, toasts)
│   │   ├── globals.css            # Tailwind v4 global styles
│   │   ├── articles/page.tsx
│   │   ├── community/page.tsx
│   │   ├── goals/page.tsx
│   │   ├── notes/page.tsx
│   │   ├── open-source/page.tsx
│   │   ├── opportunities/page.tsx
│   │   └── weekly-review/page.tsx
│   ├── components/
│   │   ├── app-layout.tsx         # App shell with sidebar
│   │   ├── sidebar.tsx            # 8-link responsive sidebar
│   │   ├── ui/                    # shadcn/ui primitives (14 components)
│   │   └── {articles,community,goals,notes,open-source,opportunities,weekly-review}/
│   ├── generated/prisma/          # Prisma client (auto-generated)
│   └── lib/
│       ├── prisma.ts              # PrismaClient singleton
│       ├── utils.ts               # cn() utility
│       └── validations/           # Zod schemas per model
├── .env                           # DATABASE_URL
├── components.json                # shadcn/ui config
├── next.config.ts                 # Next.js config
├── prisma.config.ts               # Prisma config (schema + seed)
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Database Setup

```bash
# Run migrations to create the SQLite database
npm run db:migrate

# Seed with sample data
npm run db:seed

# (Optional) Open Prisma Studio to browse data
npm run db:studio
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Reset

```bash
npm run db:reset
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset database (migrate + seed) |

## Database Schema

Seven models connected via Prisma with SQLite:

- **Opportunity** — title, organization, url, category, status, description
- **Article** — title, platform, status, url
- **Contribution** — title, repository, type, status, url
- **Community** — name, role, joinedAt
- **WeeklyReview** — weekStart, weekEnd, learned, built, wrote, contributed, reflection
- **Goal** — title, description, icon, isActive, progress (0–100)
- **Note** — title, content, category, optional relations to Opportunity/Article/Contribution/Community

## License

Private — internal DevRel OS tool.
# devrel-os
