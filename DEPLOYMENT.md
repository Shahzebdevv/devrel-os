# Deployment Guide

## Prerequisites

- Node.js 20+
- npm
- A [Vercel](https://vercel.com) account (recommended host)
- (Optional) [Turso](https://turso.tech) account for serverless SQLite

## Environment Variables

Create a `.env` file in the project root with the following:

```env
# Local SQLite database file (default)
DATABASE_URL="file:./prisma/dev.db"

# For Vercel/Turso production, use a remote libsql URL instead:
# DATABASE_URL="libsql://your-db.turso.io?authToken=your-token"
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Connection string for SQLite/libsql |

## Local Production Build

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma migrate dev

# Seed sample data
npm run db:seed

# Build for production
npm run build

# Start production server
npm start
```

## Vercel Deployment

### 1. Prepare the Project

Ensure `package.json` contains the build command:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

### 2. Database Strategy for Vercel Serverless

Prisma v7 with the `@prisma/adapter-libsql` adapter supports both local SQLite and remote Turso databases. Since Vercel's serverless functions have ephemeral filesystems, **local SQLite files do not persist across deployments**.

#### Option A: Turso (Recommended)

1. Sign up at [turso.tech](https://turso.tech) and create a database:

   ```bash
   turso auth login
   turso db create devrel-os
   turso db show devrel-os --url  # Copy the libsql URL
   turso db create-token devrel-os  # Copy the auth token
   ```

2. Set environment variables in Vercel:

   ```bash
   vercel env add DATABASE_URL "libsql://your-db.turso.io?authToken=your-token"
   vercel env add TURSO_DB_TOKEN "your-auth-token"
   ```

3. Update `prisma.config.ts` datasource URL to use the environment variable:

   ```ts
   // prisma.config.ts already reads from process.env.DATABASE_URL
   ```

4. Push the schema to Turso:

   ```bash
   npx prisma db push
   ```

5. Seed the remote database (runs once):

   ```bash
   npx prisma db seed
   ```

#### Option B: Local SQLite (Development Only)

For local development only. The `dev.db` file is pre-seeded but will reset on each Vercel deployment.

### 3. Deploy to Vercel

#### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL

# Deploy to production
vercel --prod
```

#### Using Git Integration

1. Push your repository to GitHub/GitLab/Bitbucket.
2. Import the project in the Vercel dashboard.
3. Set the `DATABASE_URL` environment variable in Vercel's project settings.
4. Deploy — Vercel will run `npm run build` automatically.

### 4. Post-Deployment

- Run database migrations on the production database:

  ```bash
  # After deploying schema changes, run this locally pointed at Turso:
  DATABASE_URL="libsql://your-db.turso.io?authToken=your-token" npx prisma db push
  ```

- Seed production data:

  ```bash
  DATABASE_URL="libsql://your-db.turso.io?authToken=your-token" npx prisma db seed
  ```

## Configuration Files

### `prisma.config.ts`

```ts
// Schema path, datasource URL from env, and seed command
export default {
  schema: "prisma/schema.prisma",
  datasourceUrl: process.env.DATABASE_URL,
  seed: {
    command: "tsx prisma/seed.ts",
  },
}
```

### `next.config.ts`

```ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Turbopack root warning silenced
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
```

## Verification Checklist

Before deploying:

- [ ] `npm run lint` passes with zero errors
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run build` compiles successfully
- [ ] `DATABASE_URL` is set in production environment
- [ ] Database migrations have been applied to production
- [ ] Seed data exists in production database

After deploying:

- [ ] Dashboard loads with correct metrics
- [ ] All 8 routes are accessible
- [ ] CRUD operations work (create, edit, delete)
- [ ] Toast notifications appear on actions
