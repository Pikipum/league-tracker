# League Tracker

**League Tracker** is a web application for exploring League of Legends match history, profile details, and statistics derived from the Riot API data. It pairs a **React** frontend with an **Node/Express** backend and **Postgres** database, and integrates with the Riot Games API for match and account data. The frontend relies on the **Material UI** component library.

Work log can be viewed at: [Work Log](https://github.com/Pikipum/league-tracker/blob/main/documentation/work_log.md)

## The app can be viewed at http://league-tracker.ddns.net or http://13.60.66.223

## Instructions and features

# Search

To search for profiles, you must provide a valid Riot ID (username #TAG) and game server.

For example, search for G2 Caps #1323 and select EUW from the dropdown menu. You can also login with the test credentials Username: "test" Password: "testpassword" to see a few favorited profiles.

![search](documentation/images/search.png)

# Profile View

In the player profile, you can view their match history, game profile, rank, and recent champion performance.

![profile](documentation/images/profile.png)

The player's match history is featured in the middle. Click the dropdown arrow to see additional details. Scrolling down reveals more matches if available. You can also filter the games by queue type. By default, the match history shows only Ranked Solo games.

![match history](documentation/images/match-history.png)

# Champion performance

To see the player's champion performance, navigate to the "Champions" tab. This page shows a view of the champions the player has played and statistics with an optional position filter.

![champions view](documentation/images/champions-view.png)

# Statistics scraper

To scrape all recent games for a given player to the database, navigate to the Statistics Scraper and begin scraping the available data. NOTE: The Riot API rate limits are 20/s and 100/min. If there are hundreds of games available, this process might take a while. The scraper will download all available ranked games (only games from the last 2 years are stored).

![scraper](documentation/images/scraper.png)

![scraping](documentation/images/scraping.png)

# Champion tier list

To see the performance of individual champions, navigate to the Tier List. The backend will calculate champion performance from ALL the games stored in the database. Select a filter to show statistics for different positions.

![tierlist](documentation/images/tierlist.png)

# Account creation

You can also create an account to add profiles to favorites. This will show a list of saved profiles in the home page for easy access.

![login](documentation/images/login.png)

# Mobile View

The app also features scaling for smaller screens and mobile phones. On a smaller screen, the search bar will be hidden behind a search icon and the navigation bar will be hidden behind a hamburger menu. Additionally, all components will scale accordigly.

![alt text](documentation/images/mobile-view.png)

---

## Architecture

- Frontend: React (Create React App)
- Backend: Node.js + Express
- Database: PostgreSQL
- Component library: Material UI
- External API: Riot Games API

---

## Prerequisites

- Node.js (v20+ recommended)
- npm
- PostgreSQL (Recommended to run in Docker)
- Docker & Docker Compose (optional, for running full stack locally in container or deploying to cloud)
- Riot API key (required for fetching match data)
- DDragon (Riot Data Dragon) for icons (https://riot-api-libraries.readthedocs.io/en/latest/ddragon.html)
- CDragon (Community Dragon) files for position icons (https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/)

---

## Quick Start

1. Clone the repo:

```bash
git clone https://github.com/Pikipum/league-tracker.git
cd league-tracker
```

2. Download icons

```bash
wget https://ddragon.leagueoflegends.com/cdn/dragontail-12.6.1.tgz
mkdir /public/assets
unzip dragontail-12.6.1.tgz /public/assets
rm dragontail-12.6.1.tgz
mkdir public/assets/img/lanes \
  && for p in top bottom middle jungle utility fill; do \
       wget "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-$p.png" \
       -O "public/assets/img/lanes/$p.png"; \
     done

```

3. Install dependencies (frontend/root):

```bash
npm install
```

4. Backend setup:

```bash
cd backend
npm install
# Provide .env file with API key.
# run the server in dev mode
npm run dev
```

5. Run Postgres database in Docker:

```bash
docker compose -f compose_db.yml up
```

- A SQL file for creating the initial schema is available at `backend/commands.sql`.

To initialize the DB locally (Postgres must be running):

```bash
psql -h localhost -U postgres -f backend/commands.sql
```

6. Run frontend:

```bash
npm run start
```

## Environment Variables

Create a `backend/.env` with at least the following variables (template in backend/.env_example):

```
RIOT_API_KEY=<YOUR_RIOT_API_KEY>
RIOT_URL=https://europe.api.riotgames.com
DATABASE_URL=postgres://postgres:password@localhost:5432/league
PGSSL=false
PORT=4000
FRONTEND_URL=http://localhost:3000
```

---

## Running with Docker Compose

Provide .env files to Docker Compose (template in .env_example)

Start the whole stack with Docker Compose:

```bash
docker compose up --build
```

- Frontend will be available on port 80 (nginx) as configured in `compose.yml`.
- Backend listens on port 4000.
- Postgres runs inside the `db` service.

---

## Troubleshooting

- If the frontend cannot reach the API, ensure `REACT_APP_API_URL` is set and the backend is running.
- For DB connection errors, verify `DATABASE_URL` and that Postgres is accepting connections.
- If Riot API calls fail, ensure `RIOT_API_KEY` is valid and not rate-limited. The rate limits for personal or development keys are 20 req/sec and 100 req/min.

---
