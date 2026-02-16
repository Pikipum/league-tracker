import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const LoadingCircle = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: 'center' }}>
      <CircularProgress sx={{ color: "primary.main" }} />
    </Box>
  );
};

export default LoadingCircle;
