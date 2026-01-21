import * as React from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 260,
      backgroundColor: "#2a2a2a",
      color: "#f5f5f5",
      border: "1px solid #f3c80a",
    },
  },
};

const queues = ["All", "Ranked Solo", "Normal"];

function getStyles(queue, queueType, theme) {
  return {
    color: "#f5f5f5",
    backgroundColor: "#2a2a2a",
    fontWeight: queueType.includes(queue)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const QueueSelect = ({ queueType, setQueueType }) => {
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setQueueType(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl
      sx={{
        m: 1,
        width: 320,
        "& .MuiInputLabel-root": { color: "#f5f5f5" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#f3c80a" },
        "& .MuiOutlinedInput-root": {
          color: "#f5f5f5",
          backgroundColor: "#2a2a2a",
          "& fieldset": { borderColor: "#666" },
          "&:hover fieldset": { borderColor: "#f3c80a" },
          "&.Mui-focused fieldset": { borderColor: "#f3c80a", boxShadow: "0 0 0 2px rgba(243, 200, 10, 0.25)" },
        },
        "& .MuiSelect-icon": { color: "#f5f5f5" },
      }}
    >
      <InputLabel id="queue-type">Select queue type</InputLabel>
      <Select
        labelId="queue-type"
        id="queue-type"
        value={queueType}
        onChange={handleChange}
        input={<OutlinedInput label="Queue" />}
        MenuProps={MenuProps}
        renderValue={(selected) => selected.join(", ")}
      >
        {queues.map((queue) => (
          <MenuItem
            key={queue}
            value={queue}
            sx={{
              color: "#f5f5f5",
              backgroundColor: "#2a2a2a",
              "&.Mui-selected": { backgroundColor: "#3a3a3a", fontWeight: theme.typography.fontWeightMedium },
              "&.Mui-selected:hover": { backgroundColor: "#444" },
              "&:hover": { backgroundColor: "#333" },
            }}
            style={getStyles(queue, queueType, theme)}
          >
            {queue}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default QueueSelect;