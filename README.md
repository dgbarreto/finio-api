# finio-api

Backend REST API for the Finio personal finance ecosystem.
Built with Node.js, TypeScript, Express and MongoDB.

## Stack

- **Runtime**: Node.js 22+
- **Language**: TypeScript
- **Framework**: Express
- **Database**: MongoDB Atlas (via Mongoose)
- **Auth**: JWT

## Architecture
src/
├── config/
│   └── database.ts        ← MongoDB connection
├── middleware/
│   ├── auth.ts            ← JWT authentication
│   └── errorHandler.ts    ← Global error handling
├── modules/
│   ├── auth/              ← Register, login, session
│   └── transactions/      ← CRUD transactions
├── types/
│   └── index.ts           ← Global types
└── index.ts               ← Entry point

## Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/health` | Health check | ❌ |
| POST | `/auth/register` | Register user | ❌ |
| POST | `/auth/login` | Login | ❌ |
| GET | `/transactions` | List transactions | ✅ |
| POST | `/transactions` | Create transaction | ✅ |
| PUT | `/transactions/:id` | Update transaction | ✅ |
| DELETE | `/transactions/:id` | Delete transaction | ✅ |

## Setup

**1. Install dependencies**
```bash
npm install
```

**2. Configure environment**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**3. Run in development**
```bash
npm run dev
```

**4. Build for production**
```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | Environment (development/production) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | JWT expiration time (default: 7d) |

## Requirements

- Node.js 22+
- MongoDB Atlas account (free tier)