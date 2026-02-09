import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Champions from "./Champions";
import PageLayout from "./PageLayout";
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
    <PageLayout
      region={region}
      setRegion={setRegion}
      navBarProps={{
        puuid,
        gameName: profileData?.gameName,
        tagLine: profileData?.tagLine,
        region,
      }}
    >
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
    </PageLayout>
  );
};

export default ChampionsPage;
