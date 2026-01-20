import { useEffect, useState } from "react";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MatchCard from "./MatchCard";
import LoadingCircle from "./LoadingCircle";
import InfiniteScroll from "react-infinite-scroll-component";
import Box from "@mui/material/Box";

const MatchHistory = ({ puuid }) => {
  const [matchHistory, setMatchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const url = process.env.REACT_APP_RIOT_URL;
  const api_key = process.env.REACT_APP_RIOT_API_KEY;
  const [matchIdStart, setMatchIdStart] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  // puuid = gvfJ4Sy5gm1L1rzvYw8w0fFjOJZpSAIiGv6FVw-Bo1Sc9MfatXnj6ugbk3-oFdukLewGmRbkrec4ZQ

  useEffect(() => {
    if (!puuid || !url || !api_key) return;

    const fetchMatchHistory = async () => {
      setIsLoading(true);
      try {
        const idsResponse = await axios.get(
          `${url}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${matchIdStart}&count=10&api_key=${api_key}`,
        );

        const matchPromises = idsResponse.data.map(
          (matchId, index) =>
            new Promise((resolve) => {
              setTimeout(async () => {
                try {
                  //                 const matchData = await axios.get(
                  //                    `${url}/lol/match/v5/matches/${matchId}?api_key=${api_key}`
                  //                  );
                  const matchData = await axios.get(
                    `http://localhost:4000/matches/${matchId}`,
                  );
                  resolve(matchData.data);
                } catch (error) {
                  console.error(`Failed to fetch match ${matchId}:`, error);
                  resolve(null);
                }
              }, index * 100);
            }),
        );

        const matches = await Promise.all(matchPromises);
        setMatchHistory((prev) => {
          const seen = new Set(prev.map((m) => m?.metadata?.matchId));
          const fresh = matches.filter(
            (m) => m && !seen.has(m.metadata?.matchId),
          );
          return [...prev, ...fresh];
        });
      } catch (error) {
        console.error("Failed to fetch match history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchHistory();
  }, [puuid, url, api_key, matchIdStart]);

  if (isLoading && initialLoad) {
    setInitialLoad(false);
    return <LoadingCircle />;
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
          <ListItem key={matchData.metadata.matchId}>
            <MatchCard matchData={matchData} puuid={puuid} />
          </ListItem>
        ))}
      </List>
    </InfiniteScroll>
  );
};

export default MatchHistory;
