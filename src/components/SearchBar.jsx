import { Button, TextField } from "@mui/material";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DarkDropdownMenu from "./DarkDropdownMenu";
import { getRegionList } from "../util/helperFunctions";

const SearchBar = ({ region, setRegion }) => {
  const navigate = useNavigate();
  const [summoner, setSummoner] = useState("");
  const regions = getRegionList();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!summoner.trim()) return;
    navigate(`/${region}/${encodeURIComponent(summoner.trim())}`);
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
      <DarkDropdownMenu
        label={region}
        options={regions}
        selected={region}
        onSelect={setRegion}
      />
      <Button
        variant="contained"
        type="submit"
        className="search-bar-button"
        sx={{
          bgcolor: "primary.main",
          color: "#1e1e1e",
          fontWeight: "bold",
          "&:hover": {
            bgcolor: "primary.dark",
          },
        }}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
