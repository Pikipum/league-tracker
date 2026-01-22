import { Button, TextField } from "@mui/material";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { getRegion, getRegionList } from "../util/helperFunctions";

const SearchBar = ({ region, setRegion }) => {
  const navigate = useNavigate();
  const [summoner, setSummoner] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const regions = getRegionList();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setRegion(event.target.textContent);
    setAnchorEl(null);
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
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {region}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        {regions.map((r) => (
          <MenuItem onClick={handleClose}>{r}</MenuItem>
        ))}
      </Menu>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="search-bar-button"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
