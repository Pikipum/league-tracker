import { Button, TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DarkDropdownMenu from "./DarkDropdownMenu";
import { getRegionList } from "../util/helperFunctions";

const formSx = {
  display: "flex",
  gap: "1rem",
  width: "min(40rem, 90vw)",
};

const inputSx = {
  flex: 1,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#2a2a2a",
    color: "#f5f5f5",
    borderRadius: "4px",
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#444",
  },
  "& .MuiOutlinedInput-input::placeholder": {
    color: "#cfcfcf",
    opacity: 1,
  },
};

const buttonSx = {
  bgcolor: "primary.main",
  color: "#1e1e1e",
  fontWeight: "bold",
  py: 0,
  px: { xs: "1rem", sm: "2rem" },
  "&:hover": {
    bgcolor: "primary.dark",
  },
};

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
    <Box component="form" sx={formSx} onSubmit={(event) => handleSubmit(event)}>
      <TextField
        id="outlined-basic"
        variant="outlined"
        placeholder="Search..."
        value={summoner}
        onChange={(event) => setSummoner(event.target.value)}
        sx={inputSx}
      />
      <DarkDropdownMenu
        label={region}
        options={regions}
        selected={region}
        onSelect={setRegion}
      />
      <Button variant="contained" type="submit" sx={buttonSx}>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
