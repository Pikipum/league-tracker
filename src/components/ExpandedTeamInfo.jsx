import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import GoldLinearProgress from "./GoldLinearProgress";
import {
  getChampionIconName,
  getSummonerSpellName,
  getRuneTreeName,
  getTreeIconName,
  getKeystoneName,
  calcKDA,
} from "../util/helperFunctions";
import { DDRAGON_BASE } from "../constants";

const ExpandedTeamInfo = ({
  player,
  index,
  info,
  maxDamage,
  clickProfileName,
}) => {
  const primaryStyle = player.perks?.styles?.[0];
  const secondaryStyle = player?.perks?.styles?.[1];

  const keystoneId = primaryStyle?.selections?.[0]?.perk;
  const primaryTreeId = primaryStyle?.style;
  const secondaryTreeId = secondaryStyle?.style;

  const keystoneName = getKeystoneName(keystoneId);
  const primaryTreeName = getRuneTreeName(primaryTreeId);

  const items = [
    player?.item0,
    player?.item1,
    player?.item2,
    player?.item3,
    player?.item4,
    player?.item5,
  ].filter((id) => id !== 0);

  return (
    <Box
      key={index}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "2fr 1fr 1fr", sm: "2fr 1fr 1fr 50px 1fr" },
        alignItems: "center",
        width: "100%",
        gap: 1
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Avatar
          src={`${DDRAGON_BASE}/img/champion/${getChampionIconName(
            player.championName,
          )}.png`}
          alt={player.championName}
          slotProps={{ img: { loading: "lazy" } }}
          sx={{ width: 32, height: 32 }}
        />
        <Stack spacing={0.25} sx={{ flexShrink: 0 }}>
          <Box sx={{ display: "flex", gap: 0.25 }}>
            <Avatar
              variant="rounded"
              src={`${DDRAGON_BASE}/img/spell/${getSummonerSpellName(
                player?.summoner1Id,
              )}.png`}
              slotProps={{ img: { loading: "lazy" } }}
              sx={{ width: 15, height: 15 }}
            />
            <Avatar
              variant="rounded"
              src={`${DDRAGON_BASE}/img/spell/${getSummonerSpellName(
                player?.summoner2Id,
              )}.png`}
              slotProps={{ img: { loading: "lazy" } }}
              sx={{ width: 15, height: 15 }}
            />
          </Box>
          {info.gameMode !== "CHERRY" && (
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <Avatar
                variant="rounded"
                src={`/assets/img/perk-images/Styles/${primaryTreeName}/${keystoneName}/${keystoneName}.png`}
                slotProps={{ img: { loading: "lazy" } }}
                sx={{ width: 15, height: 15 }}
              />
              <Avatar
                variant="rounded"
                src={`/assets/img/perk-images/Styles/${getTreeIconName(
                  secondaryTreeId,
                )}.png`}
                slotProps={{ img: { loading: "lazy" } }}
                sx={{ width: 15, height: 15 }}
              />
            </Box>
          )}
        </Stack>
        <Typography
          onClick={() =>
            clickProfileName(`${player.riotIdGameName}#${player.riotIdTagline}`)
          }
          variant="caption"
          sx={{
            ":hover": { color: "white", cursor: "pointer" },
            fontSize: 13,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "text.secondary",
          }}
        >
          {player.riotIdGameName}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ fontSize: 13, color: "text.primary" }}>
          {player?.kills}/{player?.deaths}/{player?.assists}
        </Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          {calcKDA(player?.kills, player?.deaths, player?.assists)}{" "}
          KDA
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ fontSize: 13, color: "#999" }}>
          {player.totalMinionsKilled} CS
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#999" }}>
          ({""}
          {Math.round(
            (player?.totalMinionsKilled / (info.gameDuration / 60)) * 10,
          ) / 10}
          /min)
        </Typography>
      </Box>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          {Math.round((player.totalDamageDealtToChampions || 0) / 100) / 10}k
        </Typography>
        <GoldLinearProgress
          value={Math.min(
            100,
            ((player.totalDamageDealtToChampions || 0) / maxDamage) * 100,
          )}
          height={5}
          sx={{ mt: 0.5 }}
        />
      </Box>
      <Box
        sx={{
          display: { xs: "none", sm: "grid" },
          gridTemplateColumns: "repeat(6, 24px)",
          gap: 0.5,
        }}
      >
        {items.slice(0, 6).map((itemId, index) => (
          <Avatar
            key={index}
            variant="rounded"
            src={`${DDRAGON_BASE}/img/item/${itemId}.png`}
            alt={`Item ${itemId}`}
            slotProps={{ img: { loading: "lazy" } }}
            sx={{ width: 24, height: 24 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ExpandedTeamInfo;