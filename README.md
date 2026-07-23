# DarNed Sponsorship & Contact Hub 🚀

Official sponsorship, personal brand, and business inquiry platform for YouTube Minecraft content creator **DarNed** ([@DarNedYt](https://www.youtube.com/@DarNedYt) — **385,000+ Subscribers**).

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Prisma ORM**, **SQLite / PostgreSQL**, **bcryptjs**, and **Nodemailer**.

---

## 🌟 Key Features

- **Gaming Dark Theme**: Sleek dark aesthetics with electric purple (`#7c3aed`), neon pink (`#ec4899`), electric blue (`#06b6d4`), glassmorphism cards, and fluid Framer Motion animations.
- **Bilingual Support (EN / TR)**: Instant language toggle with complete English (default) and Turkish translations across all pages and administrative controls.
- **Public Portal**:
  - **Home Page**: Interactive hero banner ("Let's Create Something Viral Together"), live channel stats counters (385k+ subs, 142M+ total views, 340+ videos), featured viral Shorts & long videos, sponsorship perks, and FAQ accordion.
  - **About Page**: Creator backstory, audience demographic breakdowns (US primary market 45%, UK/EU 35%, 13-28 age bracket), and brand values.
  - **Sponsorship Page**: Dynamic package tiers (YouTube Shorts Integration, Dedicated Long Video, Mid-roll, Brand Ambassador), pricing visibility controls, and direct "Request a Quote" buttons pre-filling the contact form.
  - **Contact Page**: Advanced multi-field inquiry form, Zod validation, file attachment simulation, terms verification, automatic ticket number generator (`TICK-XXXXXX`), auto-responder emails to user, and instant notification alerts to admin.
  - **Terms & Privacy Pages**: Complete legal documentation.
- **Partner User Dashboard**:
  - View all submitted tickets & conversation history.
  - Interactive multi-turn reply thread with DarNed's team.
  - Profile & password management.
- **Admin Command Center**:
  - Restricted access for `ADMIN`, `SUPER_ADMIN`, and `STAFF` roles.
  - **Overview Metrics**: Total users, total tickets, open/pending/answered/closed counts, 7-day trend metrics, and audit log history.
  - **Ticket Triage**: Search, status & priority filtering, thread inspector, admin reply with optional direct email dispatch, staff assignment, internal notes, and soft delete with confirm modal.
  - **User Directory**: Search, role modification, ban/unban toggle, email verification status, and account deletion (Super Admin only).
  - **Site Content Editor**: Dynamic control of announcement banner, channel statistics counters, package pricing, and system maintenance toggles.
  - **Email Center**: Single direct email composer, HTML preset templates, and delivery logbook.

---

## ⚡ Quick Start & Execution Commands

Follow these commands to install dependencies, generate the database, run the seed script, and launch the development server:

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

---

## 🔑 Initial Admin & Test Account Credentials

The database seed script (`prisma/seed.ts`) automatically populates the root Super Admin and a sample test partner account reading credentials from `.env`:

### Super Admin Account
- **Email:** `admin@darned.yt` (configured via `ADMIN_EMAIL`)
- **Password:** `AdminPassword123!` (configured via `ADMIN_INITIAL_PASSWORD`)
- **Role:** `SUPER_ADMIN`
- **Dashboard:** `/admin`

### Test Partner User Account
- **Email:** `partner@brandexample.com`
- **Password:** `UserPassword123!`
- **Role:** `USER`
- **Dashboard:** `/dashboard`

---

## 🛠️ Tech Stack & Architecture

```
src/
├── app/                  # Next.js App Router (Public, Auth, Dashboard, Admin routes)
├── components/
│   ├── about/            # About page client components
│   ├── admin/            # Admin command center views (Tickets, Users, Content, Emails)
│   ├── auth/             # Login, Register, Forgot & Reset Password views
│   ├── contact/          # Advanced Contact Form with Ticket Generator
│   ├── dashboard/        # Partner User Dashboard & Ticket Detail Threads
│   ├── home/             # Hero, Stats, Featured Shorts & Long Videos showcase
│   ├── layout/           # Responsive Navbar, Footer, Announcement Banner
│   ├── providers/        # LanguageProvider context (EN/TR)
│   ├── sponsorship/      # Interactive Sponsorship Package Cards
│   └── ui/               # Toast, ConfirmModal, TicketStatusBadge
├── config/               # i18n Dictionary & Site Settings
├── lib/                  # db (Prisma), auth (JWT/Cookies), security, mail, utils, zod-schemas
├── server/actions/       # Next.js Server Actions (auth, tickets, admin)
└── styles/               # Tailwind CSS & Global Styles
```

---

## 🔐 Environment Variables (`.env.example`)

```env
# Database URL (SQLite for local dev, PostgreSQL for production/Vercel)
DATABASE_URL="file:./dev.db"

# JWT Session Auth Secret (Minimum 32 characters)
AUTH_SECRET="darned-hub-super-secret-jwt-token-2026-key-secure"

# Application Public URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Initial Admin Credentials (used during npm run db:seed)
ADMIN_EMAIL="admin@darned.yt"
ADMIN_INITIAL_PASSWORD="AdminPassword123!"

# SMTP Email Configuration (Nodemailer)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="smtp-user"
SMTP_PASSWORD="smtp-password"
MAIL_FROM="DarNed Hub <no-reply@darned.yt>"
ADMIN_EMAIL_NOTIFY="umran3639828@gmail.com"

# Optional Upload & YouTube API Keys
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
YOUTUBE_API_KEY=""
```

---

## 🚀 Production Deployment (Vercel & PostgreSQL)

1. **Database Setup**: Create a PostgreSQL database on [Supabase](https://supabase.com), [Neon](https://neon.tech), or Vercel Postgres. Update `prisma/schema.prisma` datasource provider to `postgresql` if deploying to PostgreSQL.
2. **Environment Variables**: Add `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`, and SMTP credentials in your Vercel Project Settings.
3. **Build & Deploy**:
   - Vercel automatically runs `npm run build` (`prisma generate && next build`).
   - Run `npx prisma db push` and `npx prisma db seed` on your production database.

---

## 🛡️ Security Implementation

- **Password Protection**: All passwords hashed using `bcryptjs` (salt rounds: 10). Plain text passwords are never stored.
- **Session Protection**: Signed JWT tokens stored in HTTP-Only, SameSite=Lax cookies.
- **Server Authorization**: Every Server Action and API route verifies user identity and roles (`ADMIN` / `SUPER_ADMIN` / `STAFF`) server-side.
- **XSS & SQL Injection Safeguards**: Input sanitization via Zod schema parsing and Prisma parameterized queries.
- **Rate Limiting**: Sliding window rate limiting on login, registration, and ticket submission forms.
- **Audit Logs**: Critical administrative actions (role changes, account bans, deletions, setting updates) are recorded in the `AuditLog` table.
