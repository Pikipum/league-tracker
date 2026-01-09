import { useEffect, useState } from "react";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MatchCard from "./MatchCard";

const MatchHistory = ({ puuid }) => {
  const [matchHistory, setMatchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const url = process.env.REACT_APP_RIOT_URL;
  const api_key = process.env.REACT_APP_RIOT_API_KEY;

  useEffect(() => {
    if (!puuid || !url || !api_key) return;

    const fetchMatchHistory = async () => {
      setIsLoading(true);
      try {
        const idsResponse = await axios.get(
          `${url}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${api_key}`
        );

        const matchPromises = idsResponse.data.map(
          (matchId, index) =>
            new Promise((resolve) => {
              setTimeout(async () => {
                try {
                  const matchData = await axios.get(
                    `${url}/lol/match/v5/matches/${matchId}?api_key=${api_key}`
                  );
                  resolve(matchData.data);
                } catch (error) {
                  console.error(`Failed to fetch match ${matchId}:`, error);
                  resolve(null);
                }
              }, index * 100);
            })
        );

        const matches = await Promise.all(matchPromises);
        setMatchHistory(matches.filter((m) => m !== null));
      } catch (error) {
        console.error("Failed to fetch match history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchHistory();
  }, [puuid, url, api_key]);

  if (isLoading) {
    return <div>Loading match history...</div>;
  }

  return (
    <List>
      {matchHistory.map((matchData) => (
        <ListItem key={matchData.metadata.matchId}>
          <MatchCard matchData={matchData} puuid={puuid} />
        </ListItem>
      ))}
    </List>
  );
};

export default MatchHistory;
