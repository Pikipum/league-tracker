import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      "sans-serif",
    ].join(", "),
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#f3c80a",
      dark: "#d4af09",
    },
    error: {
      main: "#f44336",
      light: "#ff6b6b",
    },
    success: {
      main: "#4caf50",
    },
    background: {
      default: "#1f1f1f",
      paper: "#1a1a1a",
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#cfcfcf",
      disabled: "#888",
    },
  },
});

export default theme;
