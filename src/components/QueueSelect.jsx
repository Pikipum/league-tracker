import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const queues = [
  "All Matches",
  "Ranked Solo",
  "Ranked Flex",
  "ARAM",
  "Arena",
  "Quickplay",
  "Swiftplay",
  "Normal Draft",
  "Clash",
];

const QueueSelect = ({ queueType, setQueueType }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (queue) => {
    handleClose();
    setTimeout(() => setQueueType(queue), 0);
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
            color: "#f3c80a",
            bgcolor: "transparent",
          },
        }}
      >
        {queueType}
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
        {queues.map((queue) => (
          <MenuItem
            key={queue}
            onClick={() => handleSelect(queue)}
            selected={queue === queueType}
            sx={{
              fontSize: "0.9rem",
              "&:hover": { bgcolor: "#2a2a2a", color: "#f3c80a" },
              "&.Mui-selected": { bgcolor: "#2a2a2a", color: "#f3c80a" },
              "&.Mui-selected:hover": { bgcolor: "#333" },
            }}
          >
            {queue}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default QueueSelect;
