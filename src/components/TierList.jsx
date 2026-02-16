import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import LoadingCircle from "./LoadingCircle";
import ChampionRow from "./ChampionRow";
import RoleFilter, { roles } from "./RoleFilter";
import PageLayout from "./PageLayout";
import apiClient from "../util/apiClient";

const TierList = () => {
  const [tierList, setTierList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [region, setRegion] = useState("EUW");
  const [selectedRole, setSelectedRole] = useState("ALL");

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError("");
      try {
        const url = selectedRole === "ALL" 
          ? `/tierlist`
          : `/tierlist/by-role?position=${selectedRole}`;
        const resp = await apiClient.get(url);
        const statsArray = resp.data || [];

        setTierList(statsArray);
      } catch (e) {
        setError("Failed to load champion stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [selectedRole]);

  return (
    <PageLayout region={region} setRegion={setRegion}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <RoleFilter selectedRole={selectedRole} onRoleChange={setSelectedRole} showLabels />
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
            maxWidth: 400,
            minWidth: { xs: 0, sm: 350 },
            width: "100%",
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
          <ChampionRow
            key={champ.rank}
            championName={champ.champion_name}
            left={
              <Box>
                <Typography sx={{ fontSize: 16, color: "text.primary" }}>
                  {champ.champion_name}
                </Typography>
                <Typography sx={{ color: "text.disabled", fontSize: 12 }}>
                  {champ.tier}
                </Typography>
                <Typography sx={{ color: "text.disabled", fontSize: 12 }}>
                  {champ.pick_rate}% Pick rate
                </Typography>
              </Box>
            }
            right={
              <>
                <Typography sx={{ fontSize: 13, color: "text.primary" }}>
                  {champ.win_rate}% WR
                </Typography>
                <Typography sx={{ color: "text.disabled", fontSize: 12 }}>
                  {champ.wins}W / {champ.matches - champ.wins}L
                </Typography>
              </>
            }
          />
        ))}
        </Box>
      </Box>
    </PageLayout>
  );
};

export default TierList;
