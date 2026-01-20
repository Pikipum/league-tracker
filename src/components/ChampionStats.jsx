import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import LoadingCircle from "./LoadingCircle";

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
        bgcolor: "#2a2a2a",
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
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            rowGap: 0.5,
            columnGap: 1,
            p: 1,
            bgcolor: "#3a3a3a",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ gridColumn: "1 / -1", color: "#f3c80a" }}
          >
            {champ.name}
          </Typography>
          <span>Games</span>
          <span>{champ.games}</span>
          <span>W / L</span>
          <span>
            {champ.wins} / {champ.losses}
          </span>
          <span>Winrate</span>
          <span>{champ.winrate}%</span>
          <span>KDA</span>
          <span>{champ.kda}</span>
          <span>Avg K / D / A</span>
          <span>
            {champ.avgKills} / {champ.avgDeaths} / {champ.avgAssists}
          </span>
        </Box>
      ))}
    </Box>
  );
};

export default ChampionStats;
