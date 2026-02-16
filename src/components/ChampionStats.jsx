import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import LoadingCircle from "./LoadingCircle";
import GameCountSelect from "./GameCountSelect";
import ChampionRow from "./ChampionRow";
import apiClient from "../util/apiClient";

const ChampionStats = ({ puuid }) => {
  const [championStats, setChampionStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [gameCount, setGameCount] = useState(20);

  useEffect(() => {
    const fetchStats = async () => {
      if (!puuid) return;
      setIsLoading(true);
      setError("");
      try {
        const params = gameCount !== null ? { limit: gameCount } : {};
        const resp = await apiClient.get(`/matches/by-player/${puuid}`, { params });
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
  }, [puuid, gameCount]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 1,
        m: 1,
        bgcolor: "background.paper",
        color: "white",
        borderColor: "primary.main",
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle1">Top Champions</Typography>
        <GameCountSelect gameCount={gameCount} setGameCount={setGameCount} />
      </Box>
      {isLoading && <LoadingCircle />}
      {error && <Typography color="error">{error}</Typography>}
      {!isLoading && !error && championStats.length === 0 && (
        <Typography variant="body2" sx={{ color: "#aaa" }}>
          No games found
        </Typography>
      )}
      {championStats.map((champ) => (
        <ChampionRow
          key={champ.name}
          championName={champ.name}
          left={
            <Box>
              <Typography sx={{ fontSize: 16, color: "text.primary" }}>
                {champ.name}
              </Typography>
              <Typography sx={{ color: "text.disabled", fontSize: 12 }}>
                {champ.kda} KDA
              </Typography>
            </Box>
          }
          right={
            <>
              <Typography sx={{ fontSize: 13, color: "text.primary" }}>
                {champ.winrate}% WR
              </Typography>
              <Typography sx={{ color: "text.disabled", fontSize: 12 }}>
                {champ.wins}W / {champ.losses}L
              </Typography>
            </>
          }
        />
      ))}
    </Box>
  );
};

export default ChampionStats;
