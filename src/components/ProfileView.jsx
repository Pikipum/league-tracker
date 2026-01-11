import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MatchHistory from "./MatchHistory";
import Box from "@mui/material/Box";

const tagSplitter = (identifier) => {
  const [summonerName = "", tag = ""] = identifier.split("#", 2);
  return { summonerName, tag };
};

const ProfileView = () => {
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { name } = useParams();
  const url = process.env.REACT_APP_RIOT_URL;
  const api_key = process.env.REACT_APP_RIOT_API_KEY;
  const { summonerName, tag } = tagSplitter(name);
  // REACT_APP_RIOT_URL=https://europe.api.riotgames.com/riot
  useEffect(() => {
    if (!summonerName || !tag || !url || !api_key) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${url}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
            summonerName
          )}/${encodeURIComponent(tag)}?api_key=${api_key}`
        );
        setProfileData(response.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [summonerName, tag, url, api_key]);

  if (!isLoading) {
    return (
      <Box sx={{ bgcolor: "#1f1f1f", minHeight: "100vh", py: 3 }}>
        Player name: {profileData.gameName}
        Player tagline: {profileData.tagLine}
        <MatchHistory puuid={profileData.puuid} />
      </Box>
    );
  }
};

export default ProfileView;
