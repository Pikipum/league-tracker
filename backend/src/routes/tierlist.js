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
