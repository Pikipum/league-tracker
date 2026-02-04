import { Box, Typography, LinearProgress } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingCircle from "./LoadingCircle";
import { getRegion } from "../util/helperFunctions";
import FavoriteButton from "./FavoriteButton";

const SideBarProfile = ({ region, profileData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const api_url = process.env.REACT_APP_API_URL;
  const [summonerData, setSummonerData] = useState();
  const [summonerIconLevel, setSummonerIconLevel] = useState();

  const convertedRegion = getRegion(region);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${api_url}/profile/league/${convertedRegion}/${profileData.puuid}`,
        );
        const response_summoner = await axios.get(
          `${api_url}/profile/summoner/${convertedRegion}/${profileData.puuid}`,
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
  }, [profileData.puuid, api_url, convertedRegion]);

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
          loading="lazy"
          sx={{
            width: 64,
            height: 64,
            borderRadius: 1,
            border: "2px solid #f3c80a",
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Typography
              noWrap
              sx={{ color: "white", fontWeight: "bold", fontSize: 18, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {profileData.gameName}
            </Typography>
            <FavoriteButton profileData={profileData} region={region} />
          </Box>
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
              loading="lazy"
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
                  {summonerData.tier}{["MASTER", "GRANDMASTER", "CHALLENGER"].includes(summonerData.tier) ? "" : ` ${summonerData.rank}`}
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
