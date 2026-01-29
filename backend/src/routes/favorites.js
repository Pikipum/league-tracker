import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "./auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT puuid, game_name, tag_line, region, created_at FROM favorites WHERE user_id=$1 ORDER BY created_at DESC",
      [req.userId]
    );
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to get favorites" });
  }
});

router.get("/:puuid", async (req, res) => {
  try {
    const { puuid } = req.params;
    const r = await pool.query(
      "SELECT 1 FROM favorites WHERE user_id=$1 AND puuid=$2",
      [req.userId, puuid]
    );
    res.json({ favorited: !!r.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to check favorite" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { puuid, gameName, tagLine, region } = req.body;
    if (!puuid || !gameName || !tagLine)
      return res.status(400).json({ error: "puuid, gameName and tagLine required" });

    const r = await pool.query(
      `INSERT INTO favorites (user_id, puuid, game_name, tag_line, region)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, puuid) DO NOTHING
       RETURNING puuid, game_name, tag_line, region, created_at`,
      [req.userId, puuid, gameName, tagLine, region]
    );

    if (!r.rowCount) return res.status(200).json({ message: "already favorited" });
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to add favorite" });
  }
});

router.delete("/:puuid", async (req, res) => {
  try {
    const { puuid } = req.params;
    await pool.query(
      "DELETE FROM favorites WHERE user_id=$1 AND puuid=$2",
      [req.userId, puuid]
    );
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to remove favorite" });
  }
});

export default router;