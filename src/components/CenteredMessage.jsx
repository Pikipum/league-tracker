import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const CenteredMessage = ({ title, message, titleColor = "error.main", children, sx }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: 2,
        ...sx,
      }}
    >
      {title && (
        <Typography sx={{ color: titleColor, fontSize: 24, fontWeight: "bold" }}>
          {title}
        </Typography>
      )}
      {message && (
        <Typography sx={{ color: "text.disabled" }}>{message}</Typography>
      )}
      {children}
    </Box>
  );
};

export default CenteredMessage;
