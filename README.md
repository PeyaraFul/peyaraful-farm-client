# Peyaraful Farm

<img width="1706" height="777" alt="Screenshot 2026-07-24 200758" src="https://github.com/user-attachments/assets/e773b656-ac3b-4031-96c5-f31ce8f10cb9" />

Premium online marketplace for certified cows and buffaloes in Bangladesh. Browse, compare, and purchase healthy livestock directly from trusted farms.

**Live Site:** [peyaraful-farm-client.vercel.app](https://peyaraful-farm-client.vercel.app)


## About

Buying livestock in Bangladesh traditionally involves exploitative middlemen, opaque pricing, and no health guarantees. Peyaraful Farm solves this by connecting farmers directly with buyers — every animal is vaccinated, health-certified, and honestly described with clear pricing. No surprises, no middlemen.

## Key Features

- **Browse & Search** — filter cows/buffaloes by type, sort by price or newest, paginated results
- **Role-Based Auth** — Admin can add/edit/delete animals and manage orders; Users can browse, favorite, buy, and review
- **Purchase Flow** — one-animal-per-sale model; once sold, no one else can buy it
- **Favorites** — save animals to a personal wishlist
- **Reviews** — buyers can leave ratings and comments on purchased animals
- **Admin Dashboard** — Recharts-powered analytics (monthly revenue, animal breakdown, listings per month)
- **Contact & Care Tips** — contact form and livestock care advice
- **Responsive Design** — mobile-first with Tailwind CSS

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | BetterAuth (JWT, sessions, roles) |
| Notifications | react-hot-toast |
| Charts | Recharts |
| HTTP Client | Axios |
| Backend | Express 5, MongoDB (native driver) — see [server repo](https://github.com/PeyaraFul/peyaraful-farm-server) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- The [peyaraful-farm-server](https://github.com/PeyaraFul/peyaraful-farm-server) running on port 4001

### Setup

```bash
# 1. Clone the client
git clone https://github.com/PeyaraFul/peyaraful-farm-client.git
cd peyaraful-farm-client

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Then edit .env.local — set NEXT_PUBLIC_API_URL to your server URL

# 4. Start the dev server
npm run dev
```

The client runs at [http://localhost:3000](http://localhost:3000).

### Server Setup (quick reference)

```bash
git clone https://github.com/PeyaraFul/peyaraful-farm-server.git
cd peyaraful-farm-server
npm install
cp .env.example .env   # configure MONGODB_URI, PORT, etc.
npm run seed            # populate DB with demo data
npm run dev             # starts on port 4001
```

## Folder Structure

```
src/
├── app/
│   ├── page.tsx                  # Home — hero, featured animals, stats, FAQ
│   ├── all-cows/page.tsx         # Browse animals with search/filter/pagination
│   ├── animals/[id]/page.tsx     # Animal detail + buy
│   ├── auth/
│   │   ├── login/page.tsx        # Login (email/password, Google, demo)
│   │   └── register/page.tsx     # Registration
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard home
│   │   ├── favorites/page.tsx    # User's saved animals
│   │   ├── my-orders/page.tsx    # User's purchase history
│   │   └── admin/
│   │       ├── add-item/page.tsx      # Admin: add new animal
│   │       ├── manage-items/page.tsx  # Admin: manage listings
│   │       └── orders/page.tsx        # Admin: all orders
│   ├── about/page.tsx            # Farm story, team, mission
│   ├── contact/page.tsx          # Contact form
│   └── api/auth/[...all]/route.ts  # BetterAuth API handler
├── components/
│   ├── AnimalCard.tsx            # Reusable animal card
│   ├── Navbar.tsx                # Navigation bar
│   └── Footer.tsx                # Site footer
├── lib/
│   ├── api.ts                    # Axios instance (baseURL, credentials)
│   ├── auth.ts                   # BetterAuth server config (MongoDB adapter)
│   └── auth-client.ts            # BetterAuth client (signIn, signUp, useSession)
└── middleware.ts                  # Protects /dashboard routes — redirects to login
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Demo Credentials

Use the **"Demo Login"** button on the login page, or enter manually:

| Field | Value |
|-------|-------|
| Email | `arakash022@gmail.com` |
| Password | `12345678` |

This logs in as an **admin** user with full dashboard access.

## Environment Variables

Create a `.env.local` file in the project root:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend server URL | `http://localhost:4001` |

## Repositories

| Package | Link |
|---------|------|
| Client | [PeyaraFul/peyaraful-farm-client](https://github.com/PeyaraFul/peyaraful-farm-client) |
| Server | [PeyaraFul/peyaraful-farm-server](https://github.com/PeyaraFul/peyaraful-farm-server) |
