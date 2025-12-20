import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MatchHistory = ({ puuid }) => {
  const [matchHistory, setMatchHistory] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const url = process.env.REACT_APP_RIOT_URL;
  const api_key = process.env.REACT_APP_RIOT_API_KEY;
  // REACT_APP_RIOT_URL=https://europe.api.riotgames.com/riot
  // https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/Plo8RxlQ_TFyzzbyvZw4tD1V5XbSskgqVc331LAGzuGPjujtHQ8twuA3vdVa9JHfyatXM6-WiC3SYQ/ids?start=0&count=20&api_key=
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `${url}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${api_key}`
      )
      .then((response) => setMatchHistory(response.data))
      .finally(() => setIsLoading(false));
  }, [puuid, url, api_key]);

  if (!isLoading) {
    return JSON.stringify(matchHistory);
  }
};

export default MatchHistory;
