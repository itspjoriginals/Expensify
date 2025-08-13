# Multi-Source Expense (MERN minimal)

A minimal implementation of your app with:
- Email/password auth (JWT)
- Money requests (accept/reject + notifications)
- Sources (per-person ledgers like Father/Mother)
- Shared funds with contributors (contributors can add expenses)

## Prerequisites
- Node.js 18+
- MongoDB running locally OR an Atlas connection string

## Setup

### 1) Backend
```bash
cd server
cp .env.example .env
# edit .env if needed
npm install
npm run dev
```

### 2) Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173

## Notes
- On accepting a money request, a Source named after the sender is auto-created for the receiver if missing, income is recorded and source balance updated.
- Shared funds allow contributors (by email) to add expenses, decrementing remaining balance and notifying others.

Generated: 2025-08-13T03:52:28.760642
