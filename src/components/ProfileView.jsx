import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MatchHistory from "./MatchHistory";

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
    setIsLoading(true);
    axios
      .get(
        `${url}/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}?api_key=${api_key}`
      )
      .then((response) => setProfileData(response.data))
      .finally(() => setIsLoading(false));
  }, [summonerName, url, api_key, tag]);

  if (!isLoading) {
    return (
      <div>
        Player name: {profileData.gameName}
        Player tagline: {profileData.tagline}
        <MatchHistory puuid={profileData.puuid} />
      </div>
    );
  }
};

export default ProfileView;
