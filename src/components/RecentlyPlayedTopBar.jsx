import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { getChampionIconName } from "../util/helperFunctions";

const RecentlyPlayedTopBar = ({ puuid, matchHistory }) => {
  const stats = useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return null;

    let totalWins = 0;
    let totalGames = 0;
    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    const champMap = {};

    matchHistory.forEach((match) => {
      const participants = match?.info?.participants;
      const p = participants?.find((x) => x.puuid === puuid);
      if (!p) return;

      totalGames += 1;
      totalWins += p.win ? 1 : 0;
      totalKills += p.kills || 0;
      totalDeaths += p.deaths || 0;
      totalAssists += p.assists || 0;

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

    const topChamps = Object.entries(champMap)
      .map(([name, s]) => ({
        name,
        games: s.games,
        wins: s.wins,
        losses: s.games - s.wins,
        winrate: Math.round((s.wins / s.games) * 100),
        kda: s.deaths
          ? ((s.kills + s.assists) / s.deaths).toFixed(2)
          : "Perfect",
      }))
      .sort((a, b) => b.games - a.games)
      .slice(0, 3);

    return {
      totalGames,
      winrate: totalGames ? Math.round((totalWins / totalGames) * 100) : 0,
      avgKills: totalGames ? (totalKills / totalGames).toFixed(1) : 0,
      avgDeaths: totalGames ? (totalDeaths / totalGames).toFixed(1) : 0,
      avgAssists: totalGames ? (totalAssists / totalGames).toFixed(1) : 0,
      kda: totalDeaths
        ? ((totalKills + totalAssists) / totalDeaths).toFixed(2)
        : "Perfect",
      topChamps,
    };
  }, [matchHistory, puuid]);

  if (!stats || stats.totalGames === 0) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", py: 1, px: 2 }}>
        <Typography sx={{ color: "#888", fontSize: 14 }}>
          Loading stats...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.5, sm: 3 },
        py: 1,
        px: 2,
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box>
          <Typography
            sx={{ color: "#e0e0e0", fontWeight: "bold", fontSize: 14 }}
          >
            {stats.winrate}% WR
          </Typography>
          <Typography sx={{ color: "#888", fontSize: 12 }}>
            Last {stats.totalGames} games
          </Typography>
        </Box>
      </Box>

      {stats.topChamps.map((champ) => (
        <Box
          key={champ.name}
          sx={{ display: "flex", alignItems: "center", gap: 1}}
        >
          <Box
            component="img"
            src={`/assets/16.1.1/img/champion/${getChampionIconName(champ.name)}.png`}
            alt={champ.name}
            loading="lazy"
            sx={{ width: 36, height: 36, borderRadius: "50%" }}
          />
          <Box>
            <Typography
              sx={{
                color: champ.winrate >= 50 ? "#3498db" : "#e74c3c",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {champ.winrate}% ({champ.wins}W {champ.losses}L)
            </Typography>
            <Typography sx={{ color: "#888", fontSize: 11 }}>
              {champ.kda} KDA
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RecentlyPlayedTopBar;
