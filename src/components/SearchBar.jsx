import { Button, TextField } from "@mui/material";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchBar = () => {
  const navigate = useNavigate();
  const [summoner, setSummoner] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!summoner.trim()) return; // optional guard
    navigate(`/${encodeURIComponent(summoner.trim())}`);
  };

  return (
    <div className="search-bar-container">
      <form
        className="search-bar-form"
        onSubmit={(event) => handleSubmit(event)}
      >
        <TextField
          id="outlined-basic"
          variant="outlined"
          placeholder="Search..."
          className="search-bar-input"
          value={summoner}
          onChange={(event) => setSummoner(event.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className="search-bar-button"
        >
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
