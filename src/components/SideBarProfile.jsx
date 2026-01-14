import { Box } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { ListItem } from "@mui/material";

const SideBarProfile = ({ profileData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const url = process.env.REACT_APP_RIOT_EUW_URL;
  const api_key = process.env.REACT_APP_RIOT_API_KEY;
  const [summonerData, setSummonerData] = useState();
  const [summonerIconLevel, setSummonerIconLevel] = useState();
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${url}/lol/league/v4/entries/by-puuid/${profileData.puuid}?api_key=${api_key}`
        );
        const response_summoner = await axios.get(
          `${url}/lol/summoner/v4/summoners/by-puuid/${profileData.puuid}?api_key=${api_key}`
        );
        setSummonerData(response.data[0]);
        setSummonerIconLevel(response_summoner.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [
    profileData.puuid,
    profileData.gameName,
    profileData.tagLine,
    url,
    api_key,
  ]);
  if (!profileData) {
    return null;
  }
  if (!isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          p: 1,
          m: 1,
          bgcolor: "#2a2a2a",
          borderColor: "#f3c80a",
          maxWidth: 300,
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box
            component="img"
            src={`/assets/16.1.1/img/profileicon/${summonerIconLevel.profileIconId}.png`}
            alt={summonerIconLevel.profileIconId}
            sx={{ width: 64, height: 64, borderRadius: 1 }}
          />
          <Box sx={{ color: "white" }}>
            {profileData.gameName} #{profileData.tagLine}
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box>
            <Box
              component="img"
              src={`/assets/ranked-emblems/${summonerData.tier}.png`}
              alt={summonerIconLevel.profileIconId}
              sx={{ width: 64, height: 64, borderRadius: 1 }}
            />
            <Box sx={{ color: "white" }}>
              {summonerData.tier} {summonerData.rank} LP:{" "}
              {summonerData.leaguePoints}
            </Box>
          </Box>
          <Box sx={{ color: "white" }}>
            W: {summonerData.wins} L: {summonerData.losses}{" "}
            {(summonerData.wins / (summonerData.wins + summonerData.losses)) *
              100}
            %
          </Box>
        </Box>
        <Box sx={{ color: "white" }}>
          Level: {summonerIconLevel.summonerLevel}
        </Box>
      </Box>
    );
  }
};

export default SideBarProfile;
