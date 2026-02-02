import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MatchHistory from "./MatchHistory";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SideBarProfile from "./SideBarProfile";
import ChampionStats from "./ChampionStats";
import LogInButton from "./LogInButton";
import LoadingCircle from "./LoadingCircle";
import SearchBar from "./SearchBar";
import MatchHistoryTopCard from "./MatchHistoryTopBar";
import NavigationBar from "./NavigationBar";

const tagSplitter = (identifier) => {
  if (!identifier)
    return {
      summonerName: "",
      tag: "",
      isValid: false,
      error: "No search query provided.",
    };

  const trimmed = identifier.trim();
  if (!trimmed.includes("#")) {
    return {
      summonerName: "",
      tag: "",
      isValid: false,
      error: "Invalid format. Please use: SummonerName#TAG",
    };
  }

  const [summonerName = "", tag = ""] = trimmed.split("#", 2);

  if (!summonerName.trim()) {
    return {
      summonerName: "",
      tag: "",
      isValid: false,
      error: "Summoner name is missing. Please use: SummonerName#TAG",
    };
  }

  if (!tag.trim()) {
    return {
      summonerName: "",
      tag: "",
      isValid: false,
      error: "Tag is missing. Please use: SummonerName#TAG",
    };
  }

  return {
    summonerName: summonerName.trim(),
    tag: tag.trim(),
    isValid: true,
    error: null,
  };
};

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
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <SearchBar region={region} setRegion={setRegion} />
            </Box>
            <NavigationBar />
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
      </Box>
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
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <SearchBar region={region} setRegion={setRegion} />
            </Box>
            <NavigationBar />
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
      </Box>
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
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <SearchBar region={region} setRegion={setRegion} />
            </Box>
            <NavigationBar />
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
            justifyContent: "center",
            flex: 1,
            gap: 2,
          }}
        >
          <Typography sx={{ color: "#f44336", fontSize: 18 }}>
            Rate limit reached, try again later
          </Typography>
        </Box>
      </Box>
    );
  }

  if (profileError) {
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
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <SearchBar region={region} setRegion={setRegion} />
            </Box>
            <NavigationBar />
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
      </Box>
    );
  }

  if (!profileData) {
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
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <SearchBar region={region} setRegion={setRegion} />
            </Box>
            <NavigationBar />
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
            justifyContent: "center",
            flex: 1,
            gap: 2,
          }}
        >
          <Typography sx={{ color: "#888" }}>
            No profile data available.
          </Typography>
        </Box>
      </Box>
    );
  }

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
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <SearchBar region={region} setRegion={setRegion} />
          </Box>
          <NavigationBar
            puuid={profileData.puuid}
            gameName={profileData.gameName}
            tagLine={profileData.tagLine}
            region={region}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <LogInButton />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box>
          <Box sx={{ width: 300, flexShrink: 0 }}>
            <SideBarProfile region={region} profileData={profileData} />
          </Box>
          <Box>
            <ChampionStats puuid={profileData.puuid} />
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
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
    </Box>
  );
};

export default ProfileView;
