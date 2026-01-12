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
        <ListItem>Icon: {summonerIconLevel.profileIconId}</ListItem>
        <ListItem>
          Player name: {profileData.gameName} — {profileData.tagLine}
        </ListItem>
        <ListItem>Summoner Level: {summonerIconLevel.summonerLevel}</ListItem>
        <ListItem>
          Rank: {summonerData.tier} {summonerData.rank}
        </ListItem>
        <ListItem>LP: {summonerData.leaguePoints}</ListItem>
        <ListItem>
          Wins: {summonerData.wins} Losses: {summonerData.losses}
        </ListItem>
      </Box>
    );
  }
};

export default SideBarProfile;
