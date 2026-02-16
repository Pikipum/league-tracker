import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import LoadingCircle from "./LoadingCircle";
import ChampionRow from "./ChampionRow";
import RoleFilter from "./RoleFilter";
import apiClient from "../util/apiClient";

const getTierColor = (tier) => {
  const colors = {
    "S+": "#ff7f7f",
    S: "#ffbf7f",
    A: "#ffdf7f",
    B: "#7fff7f",
    C: "#7fbfff",
    D: "#bf7fff",
    F: "#888",
    "?": "#555",
  };
  return colors[tier] || "#888";
};

const Champions = ({ puuid }) => {
  const [championStats, setChampionStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");

  useEffect(() => {
    const fetchStats = async () => {
      if (!puuid) return;
      setIsLoading(true);
      setError("");
      try {
        const url =
          selectedRole === "ALL"
            ? `/tierlist/by-player/${puuid}`
            : `/tierlist/by-player/${puuid}?position=${selectedRole}`;
        const resp = await apiClient.get(url);
        const statsArray = resp.data || [];
        setChampionStats(statsArray);
      } catch (e) {
        setError("Failed to load champion stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [puuid, selectedRole]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
        bgcolor: "background.paper",
        color: "white",
        borderRadius: 2,
        maxWidth: 400,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Champion Stats
        </Typography>
        <RoleFilter selectedRole={selectedRole} onRoleChange={setSelectedRole} />
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
          key={`${champ.champion_name}-${champ.position}`}
          championName={champ.champion_name}
          left={
            <Box>
              <Typography sx={{ fontSize: 14, color: "text.primary" }}>
                {champ.champion_name}
              </Typography>
              <Typography sx={{ color: "text.disabled", fontSize: 12 }}>
                {champ.avg_kills}/{champ.avg_deaths}/{champ.avg_assists} KDA
              </Typography>
              <Typography sx={{ color: "#666", fontSize: 11 }}>
                {champ.matches} games
              </Typography>
            </Box>
          }
          right={
            <>
              <Typography
                sx={{
                  fontSize: 14,
                  color: champ.win_rate >= 50 ? "success.main" : "error.main",
                  fontWeight: "bold",
                }}
              >
                {champ.win_rate}% WR
              </Typography>
              <Typography sx={{ color: "text.disabled", fontSize: 12 }}>
                {champ.wins}W / {champ.matches - champ.wins}L
              </Typography>
            </>
          }
        >
          <Box
            sx={{
              position: "absolute",
              bottom: -4,
              right: -4,
              bgcolor: getTierColor(champ.tier),
              color: "#000",
              fontSize: 10,
              fontWeight: "bold",
              px: 0.5,
              borderRadius: 0.5,
            }}
          >
            {champ.tier}
          </Box>
        </ChampionRow>
      ))}
    </Box>
  );
};

export default Champions;
