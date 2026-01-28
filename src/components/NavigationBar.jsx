import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();

  const navToTierList = () => {
    navigate(`http://localhost:4001/tierlist`);
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Box
        sx={{
          gap: 2,
          p: 1,
          m: 0,
          bgcolor: "#1a1a1a",
          borderRadius: 1,
          maxWidth: 100,
        }}
      >
        <Typography
          onClick={null}
          sx={{ ":hover": { color: "white", cursor: "pointer" } }}
        >
          Champions
        </Typography>
      </Box>
      <Box
        sx={{
          gap: 2,
          p: 1,
          m: 0,
          bgcolor: "#1a1a1a",
          borderRadius: 1,
          maxWidth: 100,
        }}
      >
        <Typography
          onClick={navToTierList}
          sx={{ ":hover": { color: "white", cursor: "pointer" } }}
        >
          Tier List
        </Typography>
      </Box>

      <Box
        sx={{
          gap: 2,
          p: 1,
          m: 0,
          bgcolor: "#1a1a1a",
          borderRadius: 1,
          maxWidth: 100,
        }}
      >
        <Typography
          onClick={null}
          sx={{ ":hover": { color: "white", cursor: "pointer" } }}
        >
          My stats
        </Typography>
      </Box>
    </Box>
  );
};

export default NavigationBar;
