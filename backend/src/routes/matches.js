import { Router } from "express";
import { pool } from "../db.js";
import { fetchMatch } from "../riotClient.js";

const router = Router();

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
