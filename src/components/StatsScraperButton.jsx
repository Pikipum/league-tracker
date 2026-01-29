import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StatsScraperButton = ({ puuid }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (!puuid) return;
    navigate(`/stats/${encodeURIComponent(puuid.trim())}`);
  };

  return (
    <Typography
      noWrap
      onClick={handleClick}
      sx={{
        color: "#cfcfcf",
        fontSize: 14,
        cursor: "pointer",
        whiteSpace: "nowrap",
        "&:hover": { color: "#fff", bgcolor: "transparent" },
      }}
    >
      Statistics Scraper
    </Typography>
  );
};

export default StatsScraperButton;
