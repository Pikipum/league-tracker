import { Button, TextField } from "@mui/material";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getRegionList } from "../util/helperFunctions";

const SearchBar = ({ region, setRegion }) => {
  const navigate = useNavigate();
  const [summoner, setSummoner] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const regions = getRegionList();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (r) => {
    handleClose();
    setTimeout(() => setRegion(r), 0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!summoner.trim()) return;
    navigate(`/${encodeURIComponent(summoner.trim())}`);
  };

  return (
    <form className="search-bar-form" onSubmit={(event) => handleSubmit(event)}>
      <TextField
        id="outlined-basic"
        variant="outlined"
        placeholder="Search..."
        className="search-bar-input"
        value={summoner}
        onChange={(event) => setSummoner(event.target.value)}
      />
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: "#e0e0e0",
          textTransform: "none",
          fontSize: "1rem",
          "&:hover": {
            color: "#f3c80a",
            bgcolor: "transparent",
          },
        }}
      >
        {region}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ sx: { py: 0.5 } }}
        PaperProps={{
          sx: {
            bgcolor: "#1e1e1e",
            border: "1px solid #3a3a3a",
            color: "#e0e0e0",
          },
        }}
      >
        {regions.map((r) => (
          <MenuItem
            key={r}
            onClick={() => handleSelect(r)}
            selected={r === region}
            sx={{
              fontSize: "0.9rem",
              "&:hover": { bgcolor: "#2a2a2a", color: "#f3c80a" },
              "&.Mui-selected": { bgcolor: "#2a2a2a", color: "#f3c80a" },
              "&.Mui-selected:hover": { bgcolor: "#333" },
            }}
          >
            {r}
          </MenuItem>
        ))}
      </Menu>
      <Button
        variant="contained"
        type="submit"
        className="search-bar-button"
        sx={{
          bgcolor: "#f3c80a",
          color: "#1e1e1e",
          fontWeight: "bold",
          "&:hover": {
            bgcolor: "#d4af09",
          },
        }}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
