import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Champions from "./Champions";
import SearchBar from "./SearchBar";
import NavigationBar from "./NavigationBar";
import LogInButton from "./LogInButton";
import axios from "axios";

const ChampionsPage = () => {
  const { puuid, region: urlRegion } = useParams();
  const [region, setRegion] = useState(urlRegion || "EUW");
  const [profileData, setProfileData] = useState(null);
  const api_url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!puuid) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${api_url}/profile/account/by-puuid/${puuid}`
        );
        setProfileData(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchProfile();
  }, [puuid, api_url]);

  return (
    <Box
      sx={{
        bgcolor: "#1f1f1f",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        px: 2,
        py: 3,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0, flex: 1, minWidth: 0 }}>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "flex-start" }}
          >
            <SearchBar region={region} setRegion={setRegion} />
          </Box>
          <NavigationBar 
            puuid={puuid}
            gameName={profileData?.gameName}
            tagLine={profileData?.tagLine}
            region={region}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <LogInButton />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Champions puuid={puuid} />
      </Box>
    </Box>
  );
};

export default ChampionsPage;
