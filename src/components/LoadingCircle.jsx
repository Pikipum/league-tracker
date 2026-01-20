import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const LoadingCircle = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: 'center' }}>
      <CircularProgress sx={{ color: "#f3c80a" }} />
    </Box>
  );
};

export default LoadingCircle;
