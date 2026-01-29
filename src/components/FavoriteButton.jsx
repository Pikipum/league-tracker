import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";

const API_URL = process.env.REACT_APP_API_URL;

const FavoriteButton = ({ profileData, region }) => {
  const [favorited, setFavorited] = useState(false);
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
      setFavorited(false);
      return;
    }
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/favorites`, {
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
        await axios.post(
          `${API_URL}/favorites`,
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
        await axios.delete(`${API_URL}/favorites/${profileData.puuid}`, {
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
