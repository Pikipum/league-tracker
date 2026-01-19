import axios from "axios";

export async function fetchMatch(matchId) {
  const { data } = await axios.get(
    `${process.env.RIOT_URL}/lol/match/v5/matches/${matchId}`,
    { params: { api_key: process.env.RIOT_API_KEY } }
  );
  return data;
}
