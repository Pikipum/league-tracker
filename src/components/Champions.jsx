import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import LoadingCircle from "./LoadingCircle";
import { getChampionIconName } from "../util/helperFunctions";

const roles = [
  { value: "ALL", label: "All", icon: "/assets/img/lanes/fill.png" },
  { value: "TOP", label: "Top", icon: "/assets/img/lanes/top.png" },
  { value: "JUNGLE", label: "Jungle", icon: "/assets/img/lanes/jungle.png" },
  { value: "MIDDLE", label: "Mid", icon: "/assets/img/lanes/middle.png" },
  { value: "BOTTOM", label: "ADC", icon: "/assets/img/lanes/bottom.png" },
  { value: "UTILITY", label: "Support", icon: "/assets/img/lanes/support.png" },
];

const RoleFilter = ({ selectedRole, onRoleChange }) => {
  return (
    <ToggleButtonGroup
      value={selectedRole}
      exclusive
      onChange={(e, newRole) => {
        if (newRole !== null) {
          onRoleChange(newRole);
        }
      }}
      sx={{
        bgcolor: "#2a2a2a",
        borderRadius: 1,
        "& .MuiToggleButton-root": {
          color: "#888",
          border: "none",
          px: 1.5,
          py: 0.5,
          "&:hover": {
            bgcolor: "#3a3a3a",
          },
          "&.Mui-selected": {
            bgcolor: "#3a3a3a",
            color: "#f3c80a",
            "&:hover": {
              bgcolor: "#4a4a4a",
            },
          },
        },
      }}
    >
      {roles.map((role) => (
        <ToggleButton key={role.value} value={role.value}>
          <Box
            component="img"
            src={role.icon}
            alt={role.label}
            sx={{ width: 20, height: 20 }}
          />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

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
  const api_url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      if (!puuid) return;
      setIsLoading(true);
      setError("");
      try {
        const url =
          selectedRole === "ALL"
            ? `${api_url}/tierlist/by-player/${puuid}`
            : `${api_url}/tierlist/by-player/${puuid}?position=${selectedRole}`;
        const resp = await axios.get(url);
        const statsArray = resp.data || [];
        setChampionStats(statsArray);
      } catch (e) {
        setError("Failed to load champion stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [puuid, api_url, selectedRole]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
        bgcolor: "#1a1a1a",
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
        <Box
          key={`${champ.champion_name}-${champ.position}`}
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
            <Box sx={{ position: "relative" }}>
              <Box
                component="img"
                src={`/assets/16.1.1/img/champion/${getChampionIconName(
                  champ.champion_name
                )}.png`}
                alt={champ.champion_name}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                }}
              />
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
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, color: "#f5f5f5" }}>
                {champ.champion_name}
              </Typography>
              <Typography sx={{ color: "#888", fontSize: 12 }}>
                {champ.avg_kills}/{champ.avg_deaths}/{champ.avg_assists} KDA
              </Typography>
              <Typography sx={{ color: "#666", fontSize: 11 }}>
                {champ.matches} games
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                fontSize: 14,
                color: champ.win_rate >= 50 ? "#4caf50" : "#f44336",
                fontWeight: "bold",
              }}
            >
              {champ.win_rate}% WR
            </Typography>
            <Typography sx={{ color: "#888", fontSize: 12 }}>
              {champ.wins}W / {champ.matches - champ.wins}L
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Champions;
