import { Box, Typography, Stack, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import StatsScraperButton from "./StatsScraperButton";
import LogInButton from "./LogInButton";

const NavigationBar = ({
  puuid,
  gameName,
  tagLine,
  region,
  sticky = false,
  showAuthButton = false,
  searchOpen,
  onSearchToggle,
  sx: sxProp,
}) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const profilePath =
    gameName && tagLine && region
      ? `/${region}/${encodeURIComponent(`${gameName}#${tagLine}`)}`
      : null;

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Profile", to: profilePath },
    {
      label: "Champions",
      to: puuid && region ? `/champions/${region}/${puuid}` : null,
    },
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
        bgcolor: "background.paper",
        borderBottom: "1px solid #222",
        py: 1,
        mt: 2,
        borderRadius: 2,
        width: "100%",
        maxWidth: "min(40rem, 90vw)",
      };

  const innerSx = {
    px: 2,
    display: "flex",
    alignItems: "center",
    ...(sticky
      ? {
          bgcolor: "background.paper",
          borderBottom: "1px solid #222",
          borderRadius: 2,
          width: "fit-content",
          maxWidth: "min(40rem, 90vw)",
        }
      : { width: "100%" }),
  };

  const filteredNavItems = navItems.filter((item) => item.to !== null);

  return (
    <Box sx={{ ...containerSx, ...sxProp }}>
      <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: 0.5, width: "100%" }}>
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{ color: "text.secondary" }}
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </IconButton>
        {onSearchToggle && (
          <IconButton
            onClick={onSearchToggle}
            sx={{ color: "text.secondary" }}
            aria-label="Toggle search"
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
        )}
        <Box sx={{ ml: "auto" }}>
          <LogInButton />
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: "background.paper", color: "text.secondary", width: 220 } }}
      >
        <List>
          {filteredNavItems.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => { navigate(item.to); setDrawerOpen(false); }}
              sx={{ "&:hover": { bgcolor: "#2a2a2a", color: "#fff" } }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        {puuid ? (
          <Box sx={{ px: 2, py: 1 }}>
            <StatsScraperButton puuid={puuid} region={region} />
          </Box>
        ) : null}
      </Drawer>

      <Box sx={{ ...innerSx, display: { xs: "none", sm: "flex" } }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          {filteredNavItems.map((item) => (
              <Box
                key={item.label}
                sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <Typography
                  onClick={() => navigate(item.to)}
                  sx={{
                    color: "text.secondary",
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
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", ml: "auto" }}>
          <LogInButton />
        </Box>
      ) : null}
    </Box>
  );
};

export default NavigationBar;
