# League Tracker 

**League Tracker** is a web application for exploring League of Legends match history, profile details, and statistics derived from the Riot API data. It pairs a **React** frontend with an **Express** backend and **Postgres** database, and integrates with the Riot Games API for match and account data.
---

## Instructions and features

To search for profiles, you must provide a valid Riot ID and game server.

For example, search for G2 Caps #1323 and select EUW from the dropdown menu.

![search](documentation/images/search.png)

In the player profile, you can view their game profile, rank, and recent champions.

![profile](documentation/images/profile.png)

The player's match history is also featured in the middle. Click the dropdown arrow to see additional details. 

![match history](documentation/images/match-history.png)

To see the player's champion performance, navigate to the "Champions" tab. This page shows a view of the champions the player has played with statistics with an optional position filter.

![champions view](documentation/images/champions-view.png)

To download all recent games for a given player, navigate to the Statistics Scraper and scrape the available data. NOTE: The Riot API rate limits are 20/s and 100/min. If there are hundreds of games available, this process might take a while. The scraper will download all available ranked games (only games from the last 2 years are stored).

![scraper](documentation/images/scraper.png)
![scraping](documentation/images/scraping.png)

To see the performance of individual champions, navigate to the Tier List. The backend will calculate champion performance from ALL the games stored in the database. Select a filter to show statistics for different positions.

![tierlist](documentation/images/tierlist.png)

You can also create an account to add profiles to favorites. This will show a list of saved profiles in the landing page for easy access.

![login](documentation/images/login.png)

---

## Features

- View player profiles and match history
- Create account to add favorite profiles
- Fetch match details via the Riot Games Match API
- View statistics: Player-specific champion performance and overall tier list
- Docker configuration for local or cloud deployment

---

## Architecture

- Frontend: React (Create React App)
- Backend: Node.js + Express
- Database: PostgreSQL
- External API: Riot Games API

---

## Prerequisites

- Node.js (v20+ recommended)
- npm
- PostgreSQL (if not using Docker)
- Docker & Docker Compose (optional, for running full stack locally or deploying to cloud)
- Riot API key (required for fetching match data)
- DDragon (Riot Data Dragon) for icons (https://riot-api-libraries.readthedocs.io/en/latest/ddragon.html)
- CDragon (Community Dragon) files for position icons (https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/)

---

## Quick Start — Local Development


1. Clone the repo:

```bash
git clone <repo-url>
cd league-tracker
```

2. Download icons

```bash
wget https://ddragon.leagueoflegends.com/cdn/dragontail-12.6.1.tgz
unzip dragontail-12.6.1.tgz /public/assets
rm dragontail-12.6.1.tgz
wget https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png
wget https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png
wget https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png
wget https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png
wget https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png
wget https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-fill.png
mkdir public/assets/img/lanes
mv *png public/assets/img/lanes/

```

3. Install dependencies (frontend/root):

```bash
npm install
```

4. Backend setup:

```bash
cd backend
npm install
# create a .env file (see example values below)
# run the server in dev mode
npm run dev
```

5. Run frontend:

```bash
npm run start
# create .env file with REACT_APP_API_URL=http://localhost:4000
```



## Environment Variables

Create a `backend/.env` with at least the following variables:

```
RIOT_API_KEY=<YOUR_RIOT_API_KEY>
RIOT_URL=https://europe.api.riotgames.com
DATABASE_URL=postgres://postgres:password@localhost:5432/league
PGSSL=false
PORT=4000
FRONTEND_URL=http://localhost:3000
```

---

## Database

- A SQL file for creating the initial schema is available at `backend/commands.sql`.

To initialize the DB locally (Postgres must be running):

```bash
psql -h localhost -U postgres -f backend/commands.sql
```

Or, use Docker Compose (see below) which provides a Postgres service.

---

## Running with Docker Compose

Start the whole stack with Docker Compose:

```bash
docker compose up --build
```

- Frontend will be available on port 80 (nginx) as configured in `compose.yml`.
- Backend listens on port 4000.
- Postgres runs inside the `db` service.

---

## Useful Scripts

- `npm run start` — starts the frontend dev server
- `npm run build` — builds the frontend for production
- `backend: npm run dev` — runs backend in dev mode with `nodemon`

---

## Troubleshooting

- If the frontend cannot reach the API, ensure `REACT_APP_API_URL` is set and the backend is running.
- For DB connection errors, verify `DATABASE_URL` and that Postgres is accepting connections.
- If Riot API calls fail, ensure `RIOT_API_KEY` is valid and not rate-limited. The rate limits for personal or development keys are 20 req/sec and 100 req/min.

---