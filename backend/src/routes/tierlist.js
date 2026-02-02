import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const sql = `
    WITH all_games AS (
      SELECT COUNT(DISTINCT match_id) as total_matches FROM matches
    ),
    champion_stats AS (
      SELECT 
        p->>'championName' as champion_name,
        COUNT(*) as matches,
        SUM(CASE WHEN (p->>'win')::boolean THEN 1 ELSE 0 END) as wins
      FROM matches,
      jsonb_array_elements(payload->'info'->'participants') AS p
      GROUP BY p->>'championName'
      HAVING COUNT(*) > 50
    )
    SELECT 
      champion_name,
      matches::int,
      wins::int,
      ROUND((wins::numeric / NULLIF(matches, 0)) * 100, 2) as win_rate,
      ROUND((matches::numeric / NULLIF((SELECT total_matches FROM all_games), 0)) * 100, 2) as pick_rate
    FROM champion_stats
    ORDER BY win_rate DESC
  `;

  try {
    const { rows } = await pool.query(sql);

    const withTiers = rows.map((row, index) => ({
      rank: index + 1,
      ...row,
      tier: getTier(parseFloat(row.win_rate), parseInt(row.matches)),
    }));

    res.json(withTiers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to compute tierlist" });
  }
});

router.get("/by-role", async (req, res) => {
  const { position } = req.query;
  
  const validPositions = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];
  
  if (!position) {
    return res.status(400).json({ error: "position query parameter required" });
  }
  
  const upperPosition = position.toUpperCase();
  if (!validPositions.includes(upperPosition)) {
    return res.status(400).json({ 
      error: `Invalid position. Valid positions are: ${validPositions.join(", ")}` 
    });
  }

  const sql = `
    WITH all_games AS (
      SELECT COUNT(DISTINCT match_id) as total_matches FROM matches
    ),
    champion_stats AS (
      SELECT 
        p->>'championName' as champion_name,
        COUNT(*) as matches,
        SUM(CASE WHEN (p->>'win')::boolean THEN 1 ELSE 0 END) as wins
      FROM matches,
      jsonb_array_elements(payload->'info'->'participants') AS p
      WHERE p->>'teamPosition' = $1
      GROUP BY p->>'championName'
      HAVING COUNT(*) > 50
    )
    SELECT 
      champion_name,
      matches::int,
      wins::int,
      ROUND((wins::numeric / NULLIF(matches, 0)) * 100, 2) as win_rate,
      ROUND((matches::numeric / NULLIF((SELECT total_matches FROM all_games), 0)) * 100, 2) as pick_rate
    FROM champion_stats
    ORDER BY win_rate DESC
  `;

  try {
    const { rows } = await pool.query(sql, [upperPosition]);

    const withTiers = rows.map((row, index) => ({
      rank: index + 1,
      position: upperPosition,
      ...row,
      tier: getTier(parseFloat(row.win_rate), parseInt(row.matches)),
    }));

    res.json(withTiers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to compute tierlist by role" });
  }
});

router.get("/by-player/:puuid", async (req, res) => {
  const { puuid } = req.params;
  const { position } = req.query;

  if (!puuid) return res.status(400).json({ error: "puuid required" });

  const validPositions = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];
  const upperPosition = position?.toUpperCase();
  
  if (position && !validPositions.includes(upperPosition)) {
    return res.status(400).json({ 
      error: `Invalid position. Valid positions are: ${validPositions.join(", ")}` 
    });
  }

  const params = [puuid];
  let positionFilter = "";
  
  if (upperPosition) {
    params.push(upperPosition);
    positionFilter = `AND p->>'teamPosition' = $${params.length}`;
  }

  const sql = `
    WITH player_games AS (
      SELECT COUNT(DISTINCT match_id) as total_matches 
      FROM matches
      WHERE EXISTS (
        SELECT 1 FROM jsonb_array_elements(payload->'info'->'participants') AS p
        WHERE p->>'puuid' = $1
      )
    ),
    champion_stats AS (
      SELECT 
        p->>'championName' as champion_name,
        p->>'teamPosition' as position,
        COUNT(*) as matches,
        SUM(CASE WHEN (p->>'win')::boolean THEN 1 ELSE 0 END) as wins,
        SUM((p->>'kills')::int) as total_kills,
        SUM((p->>'deaths')::int) as total_deaths,
        SUM((p->>'assists')::int) as total_assists
      FROM matches,
      jsonb_array_elements(payload->'info'->'participants') AS p
      WHERE p->>'puuid' = $1 ${positionFilter}
      GROUP BY p->>'championName', p->>'teamPosition'
    )
    SELECT 
      champion_name,
      position,
      matches::int,
      wins::int,
      total_kills::int,
      total_deaths::int,
      total_assists::int,
      ROUND((wins::numeric / NULLIF(matches, 0)) * 100, 2) as win_rate,
      ROUND((matches::numeric / NULLIF((SELECT total_matches FROM player_games), 0)) * 100, 2) as pick_rate,
      CASE WHEN total_deaths > 0 
        THEN ROUND(((total_kills + total_assists)::numeric / total_deaths), 2)
        ELSE 999.99
      END as kda
    FROM champion_stats
    ORDER BY matches DESC, win_rate DESC
  `;

  try {
    const { rows } = await pool.query(sql, params);

    const withTiers = rows.map((row, index) => ({
      rank: index + 1,
      ...row,
      tier: getTierForPlayer(parseFloat(row.win_rate), parseInt(row.matches)),
      avg_kills: (row.total_kills / row.matches).toFixed(1),
      avg_deaths: (row.total_deaths / row.matches).toFixed(1),
      avg_assists: (row.total_assists / row.matches).toFixed(1),
    }));

    res.json(withTiers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to compute player tierlist" });
  }
});

function getTierForPlayer(winRate, matches) {
  const minMatches = 3;

  if (matches < minMatches) return "?";

  if (winRate >= 70) return "S+";
  if (winRate >= 60) return "S";
  if (winRate >= 55) return "A";
  if (winRate >= 50) return "B";
  if (winRate >= 45) return "C";
  if (winRate >= 40) return "D";
  return "F";
}

function getTier(winRate, matches) {
  const minMatches = 20;

  if (matches < minMatches) return "?";

  if (winRate >= 53) return "S+";
  if (winRate >= 52) return "S";
  if (winRate >= 51) return "A";
  if (winRate >= 50) return "B";
  if (winRate >= 49) return "C";
  if (winRate >= 48) return "D";
  return "F";
}

export default router;
