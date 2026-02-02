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
        bgcolor: "#1a1a1a",
        borderBottom: "1px solid #222",
        py: 1,
        borderRadius: 2,
      }
    : {
        bgcolor: "#1a1a1a",
        borderBottom: "1px solid #222",
        py: 1,
        mt: 2,
        borderRadius: 2,
      };

  const innerSx = {
    maxWidth: 1000,
    mx: "auto",
    px: 2,
    display: "flex",
    alignItems: "center",
    width: "100%",
  };

  return (
    <Box sx={containerSx}>
      <Box sx={innerSx}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ flex: 0, flexWrap: "nowrap" }}
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

          {puuid ? <StatsScraperButton puuid={puuid} /> : null}
        </Stack>

        <Box sx={{ flex: 1 }} />

        {showAuthButton && sticky ? (
          <Box
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <LogInButton />
          </Box>
        ) : showAuthButton ? (
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <LogInButton />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default NavigationBar;
