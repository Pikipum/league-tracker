import { useEffect, useState } from "react";
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
import CenteredMessage from "./CenteredMessage";
import apiClient from "../util/apiClient";
import { tagSplitter } from "../util/tagSplitter";

const ProfileView = () => {
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [backendHealthy, setBackendHealthy] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const { name, region: urlRegion } = useParams();
  const { summonerName, tag, isValid, error: formatError } = tagSplitter(name);
  const [responseStatus, setResponseStatus] = useState();
  const [queueType, setQueueType] = useState("Ranked Solo");
  const [region, setRegion] = useState(urlRegion || "EUW");
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await apiClient.get("/health", { timeout: 5000 });
        setBackendHealthy(true);
      } catch {
        setBackendHealthy(false);
      }
    };

    checkBackendHealth();
  }, []);

  useEffect(() => {
    if (!isValid || !backendHealthy) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setProfileError(null);
      try {
        const response = await apiClient.get(
          `/profile/account/${encodeURIComponent(summonerName)}/${encodeURIComponent(tag)}`,
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
  }, [isValid, summonerName, tag, backendHealthy]);

  const handleRetry = () => {
    setBackendHealthy(null);
    window.location.reload();
  };

  if (!isValid) {
    return (
      <PageLayout region={region} setRegion={setRegion}>
        <CenteredMessage title="Invalid Search Format" message={formatError}>
          <Typography sx={{ color: "#666", fontSize: 14 }}>
            Example: G2 Caps#1323 with EUW region.
          </Typography>
        </CenteredMessage>
      </PageLayout>
    );
  }

  if (backendHealthy === null) {
    return (
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingCircle />
        <Typography sx={{ color: "text.disabled", mt: 2 }}>
          Checking server connection...
        </Typography>
      </Box>
    );
  }

  if (backendHealthy === false) {
    return (
      <PageLayout region={region} setRegion={setRegion}>
        <CenteredMessage
          title="Server Unavailable"
          message="Unable to connect to the backend server. Please try again."
        >
          <Button
            variant="contained"
            onClick={handleRetry}
            sx={{
              mt: 2,
              bgcolor: "primary.main",
              color: "#000",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Retry
          </Button>
        </CenteredMessage>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LoadingCircle />
      </Box>
    );
  }

  if (responseStatus === 429) {
    return (
      <PageLayout region={region} setRegion={setRegion}>
        <CenteredMessage
          title="Rate limit reached, try again later"
          titleColor="error.main"
        />
      </PageLayout>
    );
  }

  if (profileError) {
    return (
      <PageLayout region={region} setRegion={setRegion}>
        <CenteredMessage title="Profile Not Found" message={profileError} />
      </PageLayout>
    );
  }

  if (!profileData) {
    return (
      <PageLayout region={region} setRegion={setRegion}>
        <CenteredMessage message="No profile data available." />
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
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
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
