import { useState, useEffect } from "react";
import axios from "axios";
import ListItem from "@mui/material/ListItem";

const MatchCard = ({ match }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [matchData, setMatchData] = useState();
  const url = process.env.REACT_APP_RIOT_URL;
  const api_key = process.env.REACT_APP_RIOT_API_KEY;

  useEffect(() => {
    if (!url || !api_key) return;

    const fetchMatchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${url}/lol/match/v5/matches/${match}?api_key=${api_key}`
        );
        setMatchData(response.data);
      } catch (error) {
        console.error("Failed to fetch match history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchHistory();
  }, [match, url, api_key]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <ListItem>{JSON.stringify(matchData)}</ListItem>;
};

export default MatchCard;
