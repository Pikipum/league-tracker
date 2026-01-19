import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { pool } from "../db.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "missing credentials" });

  try {
    const userRes = await pool.query(
      "SELECT id, password_hash FROM users WHERE username=$1",
      [username]
    );
    if (!userRes.rowCount)
      return res.status(401).json({ error: "invalid login" });

    const user = userRes.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid login" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    await pool.query(
      "INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt]
    );

    return res.json({ token, expiresAt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "login failed" });
  }
});

export default router;
