import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Tooltip from "@mui/material/Tooltip";
import apiClient from "../util/apiClient";
import useAuth from "../hooks/useAuth";

const FavoriteButton = ({ profileData, region }) => {
  const [favorited, setFavorited] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setFavorited(false);
      return;
    }
    const fetch = async () => {
      try {
        const { data } = await apiClient.get("/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorited(data.some((f) => f.puuid === profileData.puuid));
      } catch (e) {
        console.log("fav fetch", e);
      }
    };
    fetch();
  }, [profileData.puuid, token]);

  const toggle = async () => {
    if (!token) {
      alert("Log in to favorite profiles.");
      return;
    }
    try {
      if (!favorited) {
        await apiClient.post(
          "/favorites",
          {
            puuid: profileData.puuid,
            gameName: profileData.gameName,
            tagLine: profileData.tagLine,
            region,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setFavorited(true);
      } else {
        await apiClient.delete(`/favorites/${profileData.puuid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorited(false);
      }
    } catch (e) {
      console.error("toggle fav", e);
    }
  };

  return (
    <Tooltip
      title={
        token
          ? favorited
            ? "Remove favorite"
            : "Add favorite"
          : "Log in to favorite"
      }
    >
      <IconButton onClick={toggle} size="small">
        {favorited ? (
          <FavoriteIcon sx={{ color: "orange" }} />
        ) : (
          <FavoriteBorderIcon sx={{ color: "orange" }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton;
