import { useMemo, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import LoadingCircle from "./LoadingCircle";
import GameCountSelect from "./GameCountSelect";
import ChampionRow from "./ChampionRow";
import apiClient from "../util/apiClient";

const buildStats = (matches, puuid) => {
  const champMap = {};
  matches.forEach((match) => {
    const participants = match?.info?.participants || match?.payload?.info?.participants || [];
    const p = participants.find((x) => x.puuid === puuid);
    if (!p) return;
    const champName = p.championName;
    if (!champMap[champName]) {
      champMap[champName] = { games: 0, wins: 0, kills: 0, deaths: 0, assists: 0 };
    }
    champMap[champName].games += 1;
    champMap[champName].wins += p.win ? 1 : 0;
    champMap[champName].kills += p.kills || 0;
    champMap[champName].deaths += p.deaths || 0;
    champMap[champName].assists += p.assists || 0;
  });

  return Object.entries(champMap)
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
};

const DB_THRESHOLD = 20;

const ChampionStats = ({ puuid, matchHistory = [] }) => {
  const [gameCount, setGameCount] = useState(20);
  const [dbStats, setDbStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const useDb = gameCount === null || gameCount > DB_THRESHOLD;

  useEffect(() => {
    if (!useDb || !puuid) {
      setDbStats(null);
      return;
    }

    let cancelled = false;
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const params = gameCount !== null ? { limit: gameCount } : {};
        const resp = await apiClient.get(`/matches/by-player/${puuid}`, { params });
        if (!cancelled) setDbStats(buildStats(resp.data || [], puuid));
      } catch {
        if (!cancelled) setDbStats([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, [puuid, gameCount, useDb]);

  const localStats = useMemo(
    () => buildStats(matchHistory.slice(0, gameCount ?? matchHistory.length), puuid),
    [puuid, matchHistory, gameCount],
  );

  const championStats = useDb ? (dbStats ?? []) : localStats;

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
      {!isLoading && championStats.length === 0 && (
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
