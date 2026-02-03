import "dotenv/config";
import express from "express";
import cors from "cors";
import matches from "./routes/matches.js";
import auth from "./routes/auth.js";
import tierlist from "./routes/tierlist.js";
import favorites from "./routes/favorites.js";
import profile from "./routes/profile.js";
import rateLimit from "express-rate-limit";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { error: "Too many attempts, please try again later" },
});

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/matches", matches);
app.use("/tierlist", tierlist);
app.use("/auth", authLimiter, auth);
app.use("/favorites", favorites);
app.use("/profile", profile);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`api listening on ${port}`));
