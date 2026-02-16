import LinearProgress from "@mui/material/LinearProgress";

const GoldLinearProgress = ({ value, height = 6, sx }) => {
  return (
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height,
        borderRadius: 3,
        bgcolor: "#444",
        "& .MuiLinearProgress-bar": {
          bgcolor: "primary.main",
          borderRadius: 3,
        },
        ...sx,
      }}
    />
  );
};

export default GoldLinearProgress;
