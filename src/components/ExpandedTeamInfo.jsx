import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { LinearProgress } from "@mui/material";
import { getChampionIconName } from "../util/helperFunctions";
import { getSummonerSpellName } from "../util/helperFunctions";
import { getRuneTreeName } from "../util/helperFunctions";
import { getTreeIconName } from "../util/helperFunctions";
import { getKeystoneName } from "../util/helperFunctions";

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
          src={`/assets/16.1.1/img/champion/${getChampionIconName(
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
              src={`/assets/16.1.1/img/spell/${getSummonerSpellName(
                player?.summoner1Id,
              )}.png`}
              slotProps={{ img: { loading: "lazy" } }}
              sx={{ width: 15, height: 15 }}
            />
            <Avatar
              variant="rounded"
              src={`/assets/16.1.1/img/spell/${getSummonerSpellName(
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
            color: "#cfcfcf",
          }}
        >
          {player.riotIdGameName}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ fontSize: 13, color: "#f5f5f5" }}>
          {player?.kills}/{player?.deaths}/{player?.assists}
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#cfcfcf" }}>
          {Math.round(
            ((player?.kills + player?.assists) / Math.max(player?.deaths, 1)) *
              10,
          ) / 10}{" "}
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
        <Typography sx={{ fontSize: 13, color: "#cfcfcf" }}>
          {Math.round((player.totalDamageDealtToChampions || 0) / 100) / 10}k
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(
            100,
            ((player.totalDamageDealtToChampions || 0) / maxDamage) * 100,
          )}
          sx={{
            height: 5,
            borderRadius: 3,
            bgcolor: "#444",
            mt: 0.5,
            "& .MuiLinearProgress-bar": {
              bgcolor: "#f3c80a",
              borderRadius: 3,
            },
          }}
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
            src={`/assets/16.1.1/img/item/${itemId}.png`}
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