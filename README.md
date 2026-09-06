# AC Core Cutting Business Website

A production-ready, mobile-first website for a local professional AC core cutting, RCC drilling, and concrete wall drilling business.

## Technology Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + PostCSS
- **Database**: PostgreSQL (relational baseline schema with pg driver)
- **Validation**: Zod schema validation
- **Icons**: Lucide React
- **Code Quality**: ESLint, TypeScript Strict Mode

## Prerequisites

- **Node.js**: v18.17+ or v20+ recommended
- **npm**: v9+ or v10+
- **PostgreSQL**: v14+ database instance

## Installation

```bash
# Clone repository
git clone <repository-url>
cd "core cutting website"

# Install dependencies
npm install
```

## Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/core_cutting_db?sslmode=disable"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_BUSINESS_PHONE="+919876543210"
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
```

> [!IMPORTANT]
> Keep `DATABASE_URL` server-only. Do not prefix private database secrets with `NEXT_PUBLIC_`.

## Database Setup & Migrations

Run database schema migrations to create core tables (`business_profile`, `services`, `service_areas`, `gallery_items`, `reviews`, `faqs`, `enquiries`, `analytics_events`):

```bash
npm run db:migrate
```

SQL DDL scripts are maintained under `db/migrations/`.

## Development Commands

```bash
# Run local development server
npm run dev

# Run TypeScript type checking
npm run typecheck

# Run ESLint check
npm run lint

# Run unit / foundation tests
npm run test
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Build Commands

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

## Testing Commands

```bash
# Run automated tests
npm run test
```

## Deployment Notes

- Deploy on Vercel or any Node.js hosting platform supporting Next.js App Router.
- Ensure `DATABASE_URL` is set in production environment variables.
- Ensure production HTTPS is forced and custom domain SSL is configured.
- Run database migrations (`npm run db:migrate`) on deployment pipelines before live traffic.
