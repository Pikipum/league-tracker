import { Router } from "express";
import { pool } from "../db.js";
import { fetchMatch, fetchMatchIds } from "../riotClient.js";

const router = Router();

router.get("/by-player/:puuid", async (req, res) => {
  const { puuid } = req.params;
  const champion = req.query.champion?.trim();
  if (!puuid) return res.status(400).json({ error: "puuid required" });

  const params = [puuid];
  let sql = `
    SELECT match_id, payload
    FROM matches
    WHERE EXISTS (
      SELECT 1
      FROM jsonb_array_elements(payload->'info'->'participants') AS p
      WHERE p->>'puuid' = $1`;

  if (champion) {
    params.push(champion);
    sql += ` AND LOWER(p->>'championName') = LOWER($${params.length})`;
  }

  sql += `) ORDER BY created_at DESC`;

  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to search matches" });
  }
});

router.get("/ids/:puuid", async (req, res) => {
  const { puuid } = req.params;
  const { queue, start = 0, count = 10, region } = req.query;

  if (!puuid) return res.status(400).json({ error: "puuid required" });

  try {
    const matchIds = await fetchMatchIds({
      puuid,
      queue: queue || undefined,
      start: parseInt(start),
      count: parseInt(count),
      region: region || undefined,
    });
    return res.json(matchIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch match ids" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { region } = req.query;
  try {
    const cached = await pool.query(
      "SELECT payload FROM matches WHERE match_id=$1",
      [id],
    );
    if (cached.rowCount) return res.json(cached.rows[0].payload);

    const data = await fetchMatch(id, region);
    await pool.query(
      "INSERT INTO matches(match_id, payload) VALUES($1, $2) ON CONFLICT (match_id) DO NOTHING",
      [id, data],
    );
    return res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch match" });
  }
});

router.get("/matchids/:puuid", async (req, res) => {
  const { puuid } = req.params;
  if (!puuid) return res.status(400).json({ error: "puuid required" });

  const params = [puuid];
  let sql = `
    SELECT match_id
    FROM matches
    WHERE EXISTS (
      SELECT 1
      FROM jsonb_array_elements(payload->'info'->'participants') AS p
      WHERE p->>'puuid' = $1`;

  sql += `) ORDER BY created_at DESC`;

  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to search matches" });
  }
});

export default router;
