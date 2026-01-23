import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import LoadingCircle from "./LoadingCircle";
import { getChampionIconName } from "../util/helperFunctions";

const ChampionStats = ({ puuid }) => {
  const [championStats, setChampionStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchStats = async () => {
      if (!puuid) return;
      setIsLoading(true);
      setError("");
      try {
        const resp = await axios.get(`${apiBase}/matches/by-player/${puuid}`);
        const matches = resp.data || [];

        const champMap = {};
        matches.forEach((match) => {
          const p = match.payload?.info?.participants?.find(
            (x) => x.puuid === puuid,
          );
          if (!p) return;
          const champName = p.championName;
          if (!champMap[champName]) {
            champMap[champName] = {
              games: 0,
              wins: 0,
              kills: 0,
              deaths: 0,
              assists: 0,
            };
          }
          champMap[champName].games += 1;
          champMap[champName].wins += p.win ? 1 : 0;
          champMap[champName].kills += p.kills || 0;
          champMap[champName].deaths += p.deaths || 0;
          champMap[champName].assists += p.assists || 0;
        });

        const statsArray = Object.entries(champMap)
          .map(([name, stats]) => ({
            name,
            games: stats.games,
            wins: stats.wins,
            losses: stats.games - stats.wins,
            winrate: Math.round((stats.wins / stats.games) * 100),
            kda: stats.deaths
              ? ((stats.kills + stats.assists) / stats.deaths).toFixed(2)
              : "Perfect",
            avgKills: (stats.kills / stats.games).toFixed(1),
            avgDeaths: (stats.deaths / stats.games).toFixed(1),
            avgAssists: (stats.assists / stats.games).toFixed(1),
          }))
          .sort((a, b) => b.games - a.games)
          .slice(0, 5);

        setChampionStats(statsArray);
      } catch (e) {
        setError("Failed to load champion stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [puuid, apiBase]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 1,
        m: 1,
        bgcolor: "#1a1a1a",
        color: "white",
        borderColor: "#f3c80a",
        maxWidth: 400,
        borderRadius: 1,
      }}
    >
      <Typography variant="subtitle1">Top Champions</Typography>
      {isLoading && <LoadingCircle />}
      {error && <Typography color="error">{error}</Typography>}
      {!isLoading && !error && championStats.length === 0 && (
        <Typography variant="body2" sx={{ color: "#aaa" }}>
          No games found
        </Typography>
      )}
      {championStats.map((champ) => (
        <Box
          key={champ.name}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            bgcolor: "#2a2a2a",
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Box
              component="img"
              src={`/assets/16.1.1/img/champion/${getChampionIconName(
                champ.name,
              )}.png`}
              alt={champ.name}
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
              }}
            />
            <Box>
              <Typography sx={{ fontSize: 16, color: "#f5f5f5" }}>
                {champ.name}
              </Typography>
              <Typography sx={{ color: "#888", fontSize: 12 }}>
                {champ.kda} KDA
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontSize: 13, color: "#f5f5f5" }}>
              {champ.winrate}% WR
            </Typography>
            <Typography sx={{ color: "#888", fontSize: 12 }}>
              {champ.wins}W / {champ.losses}L
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ChampionStats;
