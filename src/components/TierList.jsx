import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import LoadingCircle from "./LoadingCircle";
import { getChampionIconName } from "../util/helperFunctions";

const TierList = () => {
  const [tierList, setTierList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError("");
      try {
        const resp = await axios.get(`${apiBase}/tierlist`);
        const statsArray = resp.data || [];

        setTierList(statsArray);
      } catch (e) {
        setError("Failed to load champion stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [apiBase]);

  return (
    <Box
      sx={{
        bgcolor: "#1f1f1f",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        px: 2,
        py: 3,
      }}
    >
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
        <Typography variant="subtitle1">Tier List</Typography>
        {isLoading && <LoadingCircle />}
        {error && <Typography color="error">{error}</Typography>}
        {!isLoading && !error && tierList.length === 0 && (
          <Typography variant="body2" sx={{ color: "#aaa" }}>
            No games found
          </Typography>
        )}
        {tierList.map((champ) => (
          <Box
            key={champ.rank}
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
                  champ.champion_name,
                )}.png`}
                alt={champ.champion_name}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                }}
              />
              <Box>
                <Typography sx={{ fontSize: 16, color: "#f5f5f5" }}>
                  {champ.champion_name}
                </Typography>
                <Typography sx={{ color: "#888", fontSize: 12 }}>
                  {champ.tier}
                </Typography>
                <Typography sx={{ color: "#888", fontSize: 12 }}>
                  {champ.pick_rate}% Pick rate
                </Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: 13, color: "#f5f5f5" }}>
                {champ.win_rate}% WR
              </Typography>
              <Typography sx={{ color: "#888", fontSize: 12 }}>
                {champ.wins}W / {champ.matches - champ.wins}L
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TierList;
