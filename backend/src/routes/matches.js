import { Router } from "express";
import { pool } from "../db.js";
import { fetchMatch } from "../riotClient.js";

const router = Router();

router.get("/by-player/:puuid", async (req, res) => {
  const { puuid } = req.params;
  try {
    const result = await pool.query(
      "SELECT match_id, payload FROM matches WHERE payload->'metadata'->'participants' ? $1 ORDER BY created_at DESC",
      [puuid]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to search matches" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cached = await pool.query(
      "SELECT payload FROM matches WHERE match_id=$1",
      [id]
    );
    if (cached.rowCount) return res.json(cached.rows[0].payload);

    const data = await fetchMatch(id);
    await pool.query(
      "INSERT INTO matches(match_id, payload) VALUES($1, $2) ON CONFLICT (match_id) DO NOTHING",
      [id, data]
    );
    return res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch match" });
  }
});

export default router;
