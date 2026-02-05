import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const gameCountOptions = [
  { label: "Last 20", value: 20 },
  { label: "Last 100", value: 100 },
  { label: "All", value: null },
];

const GameCountSelect = ({ gameCount, setGameCount }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => {
    handleClose();
    setTimeout(() => setGameCount(option.value), 0);
  };

  const currentLabel =
    gameCountOptions.find((o) => o.value === gameCount)?.label || "All";

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: "#e0e0e0",
          textTransform: "none",
          fontSize: "0.85rem",
          p: 0.5,
          minWidth: "auto",
          "&:hover": {
            color: "#f3c80a",
            bgcolor: "transparent",
          },
        }}
      >
        {currentLabel}
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
        {gameCountOptions.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => handleSelect(option)}
            selected={option.value === gameCount}
            sx={{
              fontSize: "0.9rem",
              "&:hover": { bgcolor: "#2a2a2a", color: "#f3c80a" },
              "&.Mui-selected": { bgcolor: "#2a2a2a", color: "#f3c80a" },
              "&.Mui-selected:hover": { bgcolor: "#333" },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default GameCountSelect;
