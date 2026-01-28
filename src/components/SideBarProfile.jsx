import { Box, Typography, LinearProgress } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingCircle from "./LoadingCircle";
import { getRegion } from "../util/helperFunctions";

const SideBarProfile = ({ region, profileData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const url = process.env.REACT_APP_RIOT_ACCOUNT_URL;
  const api_key = process.env.REACT_APP_RIOT_API_KEY;
  const [summonerData, setSummonerData] = useState();
  const [summonerIconLevel, setSummonerIconLevel] = useState();

  const convertedRegion = getRegion(region);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://${convertedRegion}.${url}/lol/league/v4/entries/by-puuid/${profileData.puuid}?api_key=${api_key}`,
        );
        const response_summoner = await axios.get(
          `https://${convertedRegion}.${url}/lol/summoner/v4/summoners/by-puuid/${profileData.puuid}?api_key=${api_key}`,
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
  }, [profileData.puuid, url, api_key, convertedRegion]);

  if (!profileData) return null;
  if (isLoading) return <LoadingCircle />;

  const winrate = summonerData
    ? (
        (summonerData.wins / (summonerData.wins + summonerData.losses)) *
        100
      ).toFixed(1)
    : 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        m: 1,
        bgcolor: "#1a1a1a",
        borderRadius: 2,
        maxWidth: 320,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Box
          component="img"
          src={`/assets/16.1.1/img/profileicon/${summonerIconLevel?.profileIconId}.png`}
          alt="Profile Icon"
          sx={{
            width: 64,
            height: 64,
            borderRadius: 1,
            border: "2px solid #f3c80a",
          }}
        />
        <Box>
          <Typography sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            {profileData.gameName}
          </Typography>
          <Typography sx={{ color: "#888", fontSize: 14 }}>
            #{profileData.tagLine}
          </Typography>
          <Typography sx={{ color: "#aaa", fontSize: 12 }}>
            Level {summonerIconLevel?.summonerLevel}
          </Typography>
        </Box>
      </Box>

      {summonerData && (
        <Box
          sx={{
            bgcolor: "#2a2a2a",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box
              component="img"
              src={`/assets/ranked-emblems/${summonerData.tier}.png`}
              alt={summonerData.tier}
              sx={{ width: 48, height: 48 }}
            />
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{ color: "#f3c80a", fontWeight: "bold", fontSize: 16 }}
                >
                  {summonerData.tier} {summonerData.rank}
                </Typography>
                <Typography sx={{ color: "#888", fontSize: 14 }}>
                  {summonerData.leaguePoints} LP
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={summonerData.leaguePoints}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "#444",
                  mt: 1,
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#f3c80a",
                    borderRadius: 3,
                  },
                }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography sx={{ color: "#888", fontSize: 12 }}>
                  {winrate}% WR
                </Typography>
                <Typography sx={{ color: "#888", fontSize: 12 }}>
                  {summonerData.wins}W - {summonerData.losses}L
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SideBarProfile;
