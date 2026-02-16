import Box from "@mui/material/Box";
import { getChampionIconName } from "../util/helperFunctions";
import { DDRAGON_BASE } from "../constants";

const ChampionRow = ({ championName, left, right, children }) => {
  return (
    <Box
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
            src={`${DDRAGON_BASE}/img/champion/${getChampionIconName(championName)}.png`}
            alt={championName}
            loading="lazy"
            sx={{ width: 48, height: 48, borderRadius: 1 }}
          />
          {children}
        </Box>
        {left}
      </Box>
      {right && <Box sx={{ textAlign: "right" }}>{right}</Box>}
    </Box>
  );
};

export default ChampionRow;
