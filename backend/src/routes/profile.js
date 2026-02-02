import { Router } from "express";
import { fetchLeagueEntries, fetchSummoner, fetchAccountByRiotId, fetchAccountByPuuid } from "../riotClient.js";

const router = Router();

router.get("/account/by-puuid/:puuid", async (req, res) => {
  const { puuid } = req.params;

  if (!puuid) return res.status(400).json({ error: "puuid required" });

  try {
    const accountData = await fetchAccountByPuuid(puuid);
    return res.json(accountData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch account data" });
  }
});

router.get("/account/:summonerName/:tag", async (req, res) => {
  const { summonerName, tag } = req.params;

  if (!summonerName) return res.status(400).json({ error: "summonerName required" });
  if (!tag) return res.status(400).json({ error: "tag required" });

  try {
    const accountData = await fetchAccountByRiotId({ summonerName, tag });
    return res.json(accountData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch account data" });
  }
});

router.get("/league/:region/:puuid", async (req, res) => {
  const { region, puuid } = req.params;

  if (!puuid) return res.status(400).json({ error: "puuid required" });
  if (!region) return res.status(400).json({ error: "region required" });

  try {
    const leagueData = await fetchLeagueEntries({ region, puuid });
    return res.json(leagueData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch league entries" });
  }
});

router.get("/summoner/:region/:puuid", async (req, res) => {
  const { region, puuid } = req.params;

  if (!puuid) return res.status(400).json({ error: "puuid required" });
  if (!region) return res.status(400).json({ error: "region required" });

  try {
    const summonerData = await fetchSummoner({ region, puuid });
    return res.json(summonerData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch summoner data" });
  }
});

export default router;
