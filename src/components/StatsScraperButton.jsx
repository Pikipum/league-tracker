import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StatsScraperButton = ({ puuid }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/stats/${encodeURIComponent(puuid.trim())}`);
  };

  return (
    <div>
      <Button
        type="button"
        variant="contained"
        color="primary"
        className="login-button"
        onClick={() => handleClick()}
      >
        Statistics Scraper
      </Button>
    </div>
  );
};

export default StatsScraperButton;
