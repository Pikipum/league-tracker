import axios from "axios";

const getRoutingRegion = (platformRegion) => {
  const routingMap = {
    euw1: "europe",
    eun1: "europe",
    na1: "americas",
  };
  return routingMap[platformRegion] || "europe";
};

export async function fetchMatch(matchId, region) {
  const routingRegion = region ? getRoutingRegion(region) : "europe";
  const { data } = await axios.get(
    `https://${routingRegion}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
    { params: { api_key: process.env.RIOT_API_KEY } },
  );
  return data;
}

export async function fetchMatchIds({ puuid, queue, start, count, region }) {
  const routingRegion = region ? getRoutingRegion(region) : "europe";
  const params = {
    start,
    count,
    api_key: process.env.RIOT_API_KEY,
  };
  if (queue) params.queue = queue;

  const { data } = await axios.get(
    `https://${routingRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
    { params },
  );
  return data;
}

export async function fetchLeagueEntries({ region, puuid }) {
  const { data } = await axios.get(
    `https://${region}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
    { params: { api_key: process.env.RIOT_API_KEY } },
  );
  return data;
}

export async function fetchSummoner({ region, puuid }) {
  const { data } = await axios.get(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
    { params: { api_key: process.env.RIOT_API_KEY } },
  );
  return data;
}

export async function fetchAccountByRiotId({ summonerName, tag }) {
  const { data } = await axios.get(
    `${process.env.RIOT_URL}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(summonerName)}/${encodeURIComponent(tag)}`,
    { params: { api_key: process.env.RIOT_API_KEY } },
  );
  return data;
}

export async function fetchAccountByPuuid(puuid) {
  const { data } = await axios.get(
    `${process.env.RIOT_URL}/riot/account/v1/accounts/by-puuid/${puuid}`,
    { params: { api_key: process.env.RIOT_API_KEY } },
  );
  return data;
}
