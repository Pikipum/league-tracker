import { Box } from "@mui/material";

const ChampionStats = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        p: 1,
        m: 1,
        bgcolor: "#2a2a2a",
        color: "white",
        borderColor: "#f3c80a",
        maxWidth: 300,
        borderRadius: 1,
      }}
    >
      Champion stats
    </Box>
  );
};

export default ChampionStats;
