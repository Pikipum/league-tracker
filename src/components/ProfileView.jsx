import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MatchHistory from "./MatchHistory";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SideBarProfile from "./SideBarProfile";
import ChampionStats from "./ChampionStats";
import LoadingCircle from "./LoadingCircle";
import MatchHistoryTopCard from "./MatchHistoryTopBar";
import PageLayout from "./PageLayout";
import { tagSplitter } from "../util/tagSplitter";

const ProfileView = () => {
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [backendHealthy, setBackendHealthy] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const { name, region: urlRegion } = useParams();
  const api_url = process.env.REACT_APP_API_URL;
  const { summonerName, tag, isValid, error: formatError } = tagSplitter(name);
  const [responseStatus, setResponseStatus] = useState();
  const [queueType, setQueueType] = useState("Ranked Solo");
  const [region, setRegion] = useState(urlRegion || "EUW");
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await axios.get(`${api_url}/health`, { timeout: 5000 });
        setBackendHealthy(true);
      } catch {
        setBackendHealthy(false);
      }
    };

    if (api_url) {
      checkBackendHealth();
    }
  }, [api_url]);

  useEffect(() => {
    if (!isValid || !api_url || !backendHealthy) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setProfileError(null);
      try {
        const response = await axios.get(
          `${api_url}/profile/account/${encodeURIComponent(summonerName)}/${encodeURIComponent(tag)}`,
        );
        setProfileData(response.data);
        setResponseStatus(response.status);
      } catch (e) {
        console.log(e);
        if (e.response?.status === 404) {
          setProfileError("Summoner not found. Please check the name and tag.");
        } else if (e.response?.status === 429) {
          setResponseStatus(429);
        } else {
          setProfileError("Failed to load profile. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isValid, summonerName, tag, api_url, backendHealthy]);

  const handleRetry = () => {
    setBackendHealthy(null);
    window.location.reload();
  };

  if (!isValid) {
    return (
      <PageLayout region={region} setRegion={setRegion}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 2,
          }}
        >
          <Typography
            sx={{ color: "#f44336", fontSize: 24, fontWeight: "bold" }}
          >
            Invalid Search Format
          </Typography>
          <Typography sx={{ color: "#888" }}>{formatError}</Typography>
          <Typography sx={{ color: "#666", fontSize: 14 }}>
            Example: G2 Caps#1323 with EUW region.
          </Typography>
        </Box>
      </PageLayout>
    );
  }

  if (backendHealthy === null) {
    return (
      <Box
        sx={{
          bgcolor: "#1f1f1f",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingCircle />
        <Typography sx={{ color: "#888", mt: 2 }}>
          Checking server connection...
        </Typography>
      </Box>
    );
  }

  if (backendHealthy === false) {
    return (
      <PageLayout region={region} setRegion={setRegion}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 2,
          }}
        >
          <Typography
            sx={{ color: "#f44336", fontSize: 24, fontWeight: "bold" }}
          >
            Server Unavailable
          </Typography>
          <Typography sx={{ color: "#888" }}>
            Unable to connect to the backend server. Please try again.
          </Typography>
          <Button
            variant="contained"
            onClick={handleRetry}
            sx={{
              mt: 2,
              bgcolor: "#f3c80a",
              color: "#000",
              "&:hover": { bgcolor: "#d4af09" },
            }}
          >
            Retry
          </Button>
        </Box>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          bgcolor: "#1f1f1f",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LoadingCircle />;
      </Box>
    );
  }

  if (responseStatus === 429) {
    return (
      <PageLayout region={region} setRegion={setRegion}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 2,
          }}
        >
          <Typography sx={{ color: "#f44336", fontSize: 18 }}>
            Rate limit reached, try again later
          </Typography>
        </Box>
      </PageLayout>
    );
  }

  if (profileError) {
    return (
      <PageLayout region={region} setRegion={setRegion}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 2,
          }}
        >
          <Typography
            sx={{ color: "#f44336", fontSize: 24, fontWeight: "bold" }}
          >
            Profile Not Found
          </Typography>
          <Typography sx={{ color: "#888" }}>{profileError}</Typography>
        </Box>
      </PageLayout>
    );
  }

  if (!profileData) {
    return (
      <PageLayout region={region} setRegion={setRegion}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 2,
          }}
        >
          <Typography sx={{ color: "#888" }}>
            No profile data available.
          </Typography>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      region={region}
      setRegion={setRegion}
      navBarProps={{
        puuid: profileData.puuid,
        gameName: profileData.gameName,
        tagLine: profileData.tagLine,
        region,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexDirection: { xs: "column", md: "row" } }}>
        <Box sx={{ width: { xs: "100%", md: "auto" } }}>
          <Box sx={{ width: { xs: "100%", md: 300 }, flexShrink: 0 }}>
            <SideBarProfile region={region} profileData={profileData} />
          </Box>
          <Box>
            <ChampionStats puuid={profileData.puuid} />
          </Box>
        </Box>
        <Box sx={{ flex: 1, width: { xs: "100%", md: "auto" }, minWidth: 0 }}>
          <MatchHistoryTopCard
            puuid={profileData.puuid}
            matchHistory={matchHistory}
            queueType={queueType}
            setQueueType={setQueueType}
          />
          <MatchHistory
            matchHistory={matchHistory}
            setMatchHistory={setMatchHistory}
            puuid={profileData.puuid}
            queueType={queueType}
            region={region}
          />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default ProfileView;
