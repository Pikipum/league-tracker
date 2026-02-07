import { Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatsScraperButton from "./StatsScraperButton";
import LogInButton from "./LogInButton";

const NavigationBar = ({ puuid, gameName, tagLine, region, sticky = false, showAuthButton = false }) => {
  const navigate = useNavigate();
  
  const profilePath = gameName && tagLine && region
    ? `/${region}/${encodeURIComponent(`${gameName}#${tagLine}`)}` 
    : null;

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Profile", to: profilePath },
    { label: "Champions", to: puuid && region ? `/champions/${region}/${puuid}` : null },
    { label: "Tier List", to: "/tierlist" },
  ];

  const containerSx = sticky
    ? {
        position: "sticky",
        top: 0,
        zIndex: 20,
        py: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }
    : {
        bgcolor: "#1a1a1a",
        borderBottom: "1px solid #222",
        py: 1,
        mt: 2,
        borderRadius: 2,
        width: "fit-content",
        maxWidth: "min(40rem, 90vw)",
      };

  const innerSx = {
    px: 2,
    display: "flex",
    alignItems: "center",
    ...(sticky
      ? {
          bgcolor: "#1a1a1a",
          borderBottom: "1px solid #222",
          borderRadius: 2,
          width: "fit-content",
          maxWidth: "min(40rem, 90vw)",
        }
      : { width: "100%" }),
  };

  return (
    <Box sx={containerSx}>
      <Box sx={innerSx}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexShrink: 0, flexWrap: "nowrap", gap: 0.5, overflowX: "auto" }}
        >
          {navItems.filter(item => item.to !== null).map((item) => (
            <Box
              key={item.label}
              sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
            >
              <Typography
                onClick={() => navigate(item.to)}
                sx={{
                  color: "#cfcfcf",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  letterSpacing: 0,
                  whiteSpace: "nowrap",
                  "&:hover": { color: "#fff" },
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}

          {puuid ? <StatsScraperButton puuid={puuid} region={region} /> : null}
        </Stack>
      </Box>

      {showAuthButton ? (
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          <LogInButton />
        </Box>
      ) : null}
    </Box>
  );
};

export default NavigationBar;
