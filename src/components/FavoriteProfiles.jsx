import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Avatar,
  Typography,
  Paper,
  Tooltip,
  ListItemAvatar,
  Divider,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = process.env.REACT_APP_API_URL;

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");

const FavoriteProfiles = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const onAuthChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("auth:changed", onAuthChange);
    window.addEventListener("storage", onAuthChange);
    return () => {
      window.removeEventListener("auth:changed", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setFavorites([]);
      return;
    }
    const fetchFavs = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFavs();
  }, [token]);

  const remove = async (puuid) => {
    try {
      await axios.delete(`${API_URL}/favorites/${puuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((f) => f.puuid !== puuid));
    } catch (e) {
      console.error(e);
    }
  };

  if (!token)
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Paper sx={{ p: 4, bgcolor: "#1a1a1a", maxWidth: 900, width: "100%" }}>
          <Typography sx={{ color: "#f3c80a", fontWeight: 700, mb: 1 }}>
            Favorites
          </Typography>
          <Typography sx={{ color: "#ccc" }}>
            Log in to save and view favorite profiles.
          </Typography>
        </Paper>
      </Box>
    );

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 900,
          bgcolor: "#161616",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography sx={{ color: "#f3c80a", fontWeight: 800, fontSize: 20 }}>
            Favorites
          </Typography>
          <Typography sx={{ color: "#888", fontSize: 13 }}>
            {favorites.length} saved
          </Typography>
        </Stack>

        <Divider sx={{ bgcolor: "#2b2b2b", mb: 1 }} />

        {favorites.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography sx={{ color: "#ccc", mb: 1 }}>
              No favorites yet — add profiles from the profile view.
            </Typography>
          </Box>
        ) : (
          <List>
            {favorites.map((f) => (
              <ListItemButton
                key={f.puuid}
                onClick={() =>
                  navigate(
                    `/${encodeURIComponent(`${f.game_name}#${f.tag_line}`)}`,
                  )
                }
                sx={{
                  mb: 1,
                  bgcolor: "#1a1a1a",
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#222" },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "#2b2b2b",
                      color: "#f3c80a",
                      width: 48,
                      height: 48,
                    }}
                  >
                    {initials(f.game_name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                        {f.game_name}
                      </Typography>
                      <Typography sx={{ color: "#888", fontSize: 13 }}>
                        #{f.tag_line}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Typography sx={{ color: "#aaa", fontSize: 12 }}>
                        {f.region}
                      </Typography>
                    </Box>
                  }
                  primaryTypographyProps={{ component: "div" }}
                  secondaryTypographyProps={{ component: "div" }}
                />
                <Tooltip title="Remove favorite">
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(f.puuid);
                    }}
                    sx={{ color: "#f3c80a" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemButton>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default FavoriteProfiles;
