import "dotenv/config";
import express from "express";
import cors from "cors";
import matches from "./routes/matches.js";
import auth from "./routes/auth.js";
import tierlist from "./routes/tierlist.js";
import favorites from "./routes/favorites.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/matches", matches);
app.use("/tierlist", tierlist);
app.use("/auth", auth);
app.use("/favorites", favorites);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`api listening on ${port}`));
