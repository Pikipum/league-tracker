import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DarkDropdownMenu = ({ label, options, selected, onSelect, buttonSx }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    handleClose();
    setTimeout(() => onSelect(value), 0);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: "#e0e0e0",
          textTransform: "none",
          fontSize: "1rem",
          "&:hover": {
            color: "primary.main",
            bgcolor: "transparent",
          },
          ...buttonSx,
        }}
      >
        {label}
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
        {options.map((option) => {
          const value = typeof option === "object" ? option.value : option;
          const optionLabel = typeof option === "object" ? option.label : option;

          return (
            <MenuItem
              key={optionLabel}
              onClick={() => handleSelect(value)}
              selected={value === selected}
              sx={{
                fontSize: "0.9rem",
                "&:hover": { bgcolor: "#2a2a2a", color: "primary.main" },
                "&.Mui-selected": { bgcolor: "#2a2a2a", color: "primary.main" },
                "&.Mui-selected:hover": { bgcolor: "#333" },
              }}
            >
              {optionLabel}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default DarkDropdownMenu;
