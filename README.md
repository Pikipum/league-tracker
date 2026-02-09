# League Tracker 🚀

**League Tracker** is a web application for exploring League of Legends match history, profile details, and statistics derived from the data. It pairs a **React** frontend with an **Express** backend and **Postgres** database, and integrates with the Riot Games API for match and account data.

---

## 🔍 Features

- View player profiles and match history
- Save favorite profiles per user account
- Fetch match details via the Riot Games Match API
- Lightweight backend API for caching and session management
- Docker configuration for local or cloud deployment

---

## 🏗️ Architecture

- Frontend: React (Create React App)
- Backend: Node.js + Express
- Database: PostgreSQL
- External API: Riot Games API

---

## ✅ Prerequisites

- Node.js (v20+ recommended)
- npm
- PostgreSQL (if not using Docker)
- Docker & Docker Compose (optional, for running full stack locally)
- Riot API key (required for fetching match data)

---

## ⚡ Quick Start — Local Development

1. Clone the repo:

```bash
git clone <repo-url>
cd league-tracker
```

2. Install dependencies (frontend/root):

```bash
npm install
```

3. Backend setup:

```bash
cd backend
npm install
# create a .env file (see example values below)
# run the server in dev mode
npm run dev
```

4. Frontend dev server (from repo root):

```bash
npm start
# opens at http://localhost:3000
```

> The frontend expects an environment variable `REACT_APP_API_URL` that points to the public backend URL (e.g. `http://localhost:4000`).

---

## 🔧 Environment Variables

For local development, create a `backend/.env` with at least the following variables:

```
RIOT_API_KEY=<YOUR_RIOT_API_KEY>
RIOT_URL=https://europe.api.riotgames.com
DATABASE_URL=postgres://postgres:password@localhost:5432/league
PGSSL=false
PORT=4000
FRONTEND_URL=http://localhost:3000
```

---

## 🗄️ Database

- A SQL file for creating the initial schema is available at `backend/commands.sql`.

To initialize the DB locally (Postgres must be running):

```bash
psql -h localhost -U postgres -f backend/commands.sql
```

Or, use Docker Compose (see below) which provides a Postgres service.

---

## 🐳 Running with Docker Compose

Start the whole stack with Docker Compose:

```bash
docker compose up --build
```

- Frontend will be available on port 80 (nginx) as configured in `compose.yml`.
- Backend listens on port 4000.
- Postgres runs inside the `db` service.

---

## 📋 Useful Scripts

- `npm run start` — starts the frontend dev server
- `npm run build` — builds the frontend for production
- `backend: npm run dev` — runs backend in dev mode with `nodemon`

---

## 🛠️ Troubleshooting

- If the frontend cannot reach the API, ensure `REACT_APP_API_URL` is set and the backend is running.
- For DB connection errors, verify `DATABASE_URL` and that Postgres is accepting connections.
- If Riot API calls fail, ensure `RIOT_API_KEY` is valid and not rate-limited.

---