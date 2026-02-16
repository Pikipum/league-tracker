import { useEffect, useState } from "react";
import axios from "axios";
import List from "@mui/material/List";
import MatchCard from "./MatchCard";
import LoadingCircle from "./LoadingCircle";
import InfiniteScroll from "react-infinite-scroll-component";
import Box from "@mui/material/Box";
import CenteredMessage from "./CenteredMessage";
import { getRegion } from "../util/helperFunctions";

const getQueueId = (queueName) => {
  const queueIdsMap = {
    "All Matches": null,
    "Ranked Solo": 420,
    "Ranked Flex": 440,
    ARAM: 450,
    Arena: 1700,
    Quickplay: 490,
    Swiftplay: 480,
    "Normal Draft": 400,
    Clash: 700,
  };
  return queueIdsMap[queueName] ?? null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, maxRetries = 10) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      console.warn(
        `Request failed, retrying in 1s (attempt ${attempt + 1}/${maxRetries})`,
      );
      await sleep(1000);
    }
  }
  return null;
};

const MatchHistory = ({
  matchHistory,
  setMatchHistory,
  puuid,
  queueType,
  region,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const api_url = process.env.REACT_APP_API_URL;
  const [matchIdStart, setMatchIdStart] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentQueue, setCurrentQueue] = useState(queueType);
  const [currentRegion, setCurrentRegion] = useState(region);

  useEffect(() => {
    if (queueType !== currentQueue || region !== currentRegion) {
      setMatchHistory([]);
      setMatchIdStart(0);
      setCurrentQueue(queueType);
      setCurrentRegion(region);
      setInitialLoad(true);
      setError(null);
      return;
    }
  }, [queueType, currentQueue, region, currentRegion, setMatchHistory]);

  // puuid = gvfJ4Sy5gm1L1rzvYw8w0fFjOJZpSAIiGv6FVw-Bo1Sc9MfatXnj6ugbk3-oFdukLewGmRbkrec4ZQ
  useEffect(() => {
    if (!puuid || !currentRegion) return;

    const fetchMatchHistory = async () => {
      setIsLoading(true);
      const platformRegion = getRegion(currentRegion);
      try {
        const queueId = getQueueId(currentQueue);
        const idsResponse = await axios.get(`${api_url}/matches/ids/${puuid}`, {
          params: {
            queue: queueId,
            start: matchIdStart,
            count: 10,
            region: platformRegion,
          },
        });

        const matchPromises = idsResponse.data.map(async (matchId) => {
          try {
            const res = await fetchWithRetry(
              `${api_url}/matches/${matchId}?region=${platformRegion}`,
            );
            return res?.data ?? null;
          } catch (error) {
            console.error(`Failed to fetch match ${matchId}:`, error);
            return null;
          }
        });

        const matches = await Promise.all(matchPromises);
        setMatchHistory((prev) => {
          const seen = new Set(prev.map((m) => m?.metadata?.matchId));
          const fresh = matches.filter(
            (m) => m && !seen.has(m.metadata?.matchId),
          );
          const combined = [...prev, ...fresh];
          combined.sort(
            (a, b) =>
              (b?.info?.gameEndTimestamp || 0) -
              (a?.info?.gameEndTimestamp || 0),
          );
          return combined;
        });
      } catch (error) {
        console.error("Failed to fetch match history:", error);
        setError("Failed to load matches. Please try again later.");
      } finally {
        setIsLoading(false);
        setInitialLoad(false);
      }
    };

    fetchMatchHistory();
  }, [puuid, api_url, matchIdStart, currentQueue, currentRegion, setMatchHistory]);

  if (isLoading && initialLoad) {
    return <LoadingCircle />;
  }

  if (error && matchHistory.length === 0) {
    return (
      <CenteredMessage
        title={error}
        titleColor="error.main"
        sx={{ flex: "none", py: 4 }}
      />
    );
  }

  if (!isLoading && matchHistory.length === 0) {
    return (
      <CenteredMessage
        message="No matches found for this queue type."
        sx={{ flex: "none", py: 4 }}
      />
    );
  }

  return (
    <InfiniteScroll
      dataLength={matchHistory.length}
      next={() => setMatchIdStart((prev) => prev + 10)}
      hasMore={true}
      loader={
        <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
          <LoadingCircle />
        </Box>
      }
    >
      <List>
        {matchHistory.map((matchData) => (
          <MatchCard
            key={matchData.metadata.matchId}
            matchData={matchData}
            puuid={puuid}
          />
        ))}
      </List>
    </InfiniteScroll>
  );
};

export default MatchHistory;
