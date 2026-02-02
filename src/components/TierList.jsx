import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import LoadingCircle from "./LoadingCircle";
import { getChampionIconName } from "../util/helperFunctions";
import SearchBar from "./SearchBar";
import NavigationBar from "./NavigationBar";
import LogInButton from "./LogInButton";

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
          px: 2,
          py: 1,
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
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
            <Box
              component="img"
              src={role.icon}
              alt={role.label}
              sx={{ width: 24, height: 24 }}
            />
            <Typography sx={{ fontSize: 10, textTransform: "none" }}>{role.label}</Typography>
          </Box>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

const TierList = () => {
  const [tierList, setTierList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [region, setRegion] = useState("EUW");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const api_url = process.env.REACT_APP_API_URL

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError("");
      try {
        const url = selectedRole === "ALL" 
          ? `${api_url}/tierlist`
          : `${api_url}/tierlist/by-role?position=${selectedRole}`;
        const resp = await axios.get(url);
        const statsArray = resp.data || [];

        setTierList(statsArray);
      } catch (e) {
        setError("Failed to load champion stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [api_url, selectedRole]);

  return (
    <Box
      sx={{
        bgcolor: "#1f1f1f",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        px: 2,
        py: 3,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <SearchBar region={region} setRegion={setRegion} />
          </Box>
          <NavigationBar />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <LogInButton />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <RoleFilter selectedRole={selectedRole} onRoleChange={setSelectedRole} />
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
            minWidth: 350,
            borderRadius: 1,
          }}
        >
        <Typography variant="subtitle1">
          Tier List {selectedRole !== "ALL" && `- ${roles.find(r => r.value === selectedRole)?.label}`}
        </Typography>
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
    </Box>
  );
};

export default TierList;
