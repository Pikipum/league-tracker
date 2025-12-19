import { Button, TextField } from "@mui/material";
import "./SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <form className="search-bar-form" onSubmit={(event) => event.preventDefault()}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          placeholder="Search..."
          className="search-bar-input"
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
