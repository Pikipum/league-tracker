import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { pool } from "../db.js";

export const requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || req.headers["x-session-token"];
    if (!auth) return res.status(401).json({ error: "missing token" });
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

    const r = await pool.query(
      "SELECT user_id FROM sessions WHERE token=$1 AND expires_at > now()",
      [token],
    );
    if (!r.rowCount) return res.status(401).json({ error: "invalid token" });

    req.userId = r.rows[0].user_id;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "auth failed" });
  }
};

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "missing credentials" });

  try {
    const userRes = await pool.query(
      "SELECT id, password_hash FROM users WHERE username=$1",
      [username],
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
      [user.id, token, expiresAt],
    );

    return res.json({ token, expiresAt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "login failed" });
  }
});

router.post("/createaccount", async (req, res) => {
  const { username, password, email: providedEmail } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "missing credentials" });

  const email = providedEmail || `${username}@no-email.local`;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const userRes = await pool.query(
      "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [email, username, passwordHash],
    );

    const user = userRes.rows[0];

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    await pool.query(
      "INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt],
    );

    return res.status(201).json({ token, expiresAt });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "user already exists" });
    }
    return res.status(500).json({ error: "create account failed" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const auth = req.headers.authorization || req.headers["x-session-token"];
    if (!auth) return res.status(400).json({ error: "missing token" });
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

    await pool.query("DELETE FROM sessions WHERE token=$1", [token]);
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "logout failed" });
  }
});

export default router;
