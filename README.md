# Commitment Dashboard

A beautiful and modern commitment tracking dashboard built with Next.js, TypeScript, and Tailwind CSS. Track your commitments, measure your sincerity, and achieve your goals.

## Features

- 🔐 User authentication (login, signup, password reset)
- 📊 Dashboard with summary statistics
- ✅ Create and track commitments
- 📝 Resolve/Testify functionality for open commitments
- 📈 Sincerity metrics and calibration tracking
- 👤 Profile settings with email/password management
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with TypeORM
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form + Zod
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Commitment
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `NEXTAUTH_URL`: Your application URL (e.g., `http://localhost:3000`)
- `NEXTAUTH_SECRET`: A random secret string (generate with `openssl rand -base64 32`)

4. Initialize the database:
The database will be automatically created on first run. The SQLite database file will be created at `./commitment.db`.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Commitment/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── commitments/       # Commitment pages
│   ├── resolve/           # Resolve/Testify pages
│   └── profile/           # Profile settings
├── components/            # React components
├── entities/              # TypeORM entities
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   └── database.ts       # TypeORM data source
└── types/                 # TypeScript type definitions
```

## Features Overview

### Dashboard
- View all commitments in a sortable table
- Summary statistics (total, achieved, failed, pending, success rate, avg delta)
- Quick access to create new commitments
- Link to resolve pending commitments

### Commitments
- Create new commitments with text, confidence level, deadline, and category
- View commitment details
- Resolve commitments with outcome, evidence, and testimony
- Automatic delta calculation (time difference from deadline)

### Profile
- Update email and password
- View sincerity metrics
- Calibration by confidence bucket
- Track your commitment performance over time

## Database Schema

### User
- `id`: UUID (primary key)
- `email`: String (unique)
- `password`: String (hashed)
- `name`: String (optional)
- `createdAt`: Date
- `updatedAt`: Date

### Commitment
- `id`: UUID (primary key)
- `code`: String (format: YYYYMMDD-HHMMSS)
- `text`: String
- `declaredConfidence`: Number (0-100)
- `deadline`: Date
- `category`: String
- `outcome`: Enum (pending, achieved, failed)
- `completedAt`: Date (optional)
- `deltaMinutes`: Number (optional)
- `resolution`: String (optional)
- `evidence`: String (optional)
- `testimony`: String (optional)
- `userId`: UUID (foreign key)
- `createdAt`: Date
- `updatedAt`: Date

## Development

### Build for Production

```bash
npm run build
npm start
```

### Database Migrations

TypeORM is configured with `synchronize: true` in development mode, which automatically syncs the database schema. For production, you should use migrations.

## License

MIT

