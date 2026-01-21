import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { styled } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LinearProgress } from "@mui/material";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

const getChampionIconName = (championName) => {
  const nameMap = {
    Wukong: "MonkeyKing",
    "Nunu & Willump": "Nunu",
    LeBlanc: "Leblanc",
  };

  return nameMap[championName] || championName;
};
const getSummonerSpellName = (summonerId) => {
  const nameMap = {
    1: "SummonerBoost",
    3: "SummonerExhaust",
    4: "SummonerFlash",
    6: "SummonerHaste",
    7: "SummonerHeal",
    11: "SummonerSmite",
    12: "SummonerTeleport",
    13: "SummonerMana",
    14: "SummonerDot",
    21: "SummonerBarrier",
    30: "SummonerPoroRecall",
    31: "SummonerPoroThrow",
    32: "SummonerSnowball",
    39: "SummonerSnowURFSnowball_Mark",
    54: "Summoner_UltBookPlaceholder",
    55: "Summoner_UltBookSmitePlaceholder",
    2201: "SummonerCherryHold",
    2202: "SummonerCherryFlash",
  };

  return nameMap[summonerId] || `SummonerSpell${summonerId}`;
};

const getRuneTreeName = (treeId) => {
  const treeMap = {
    8000: "Precision",
    8100: "Domination",
    8200: "Sorcery",
    8300: "Inspiration",
    8400: "Resolve",
  };
  return treeMap[treeId];
};

const getTreeIconName = (treeId, treeName) => {
  const iconMap = {
    8000: "7201_Precision",
    8100: "7200_Domination",
    8200: "7202_Sorcery",
    8300: "7203_Whimsy",
    8400: "7204_Resolve",
  };
  return iconMap[treeId];
};

const getKeystoneName = (keystoneId) => {
  const keystoneMap = {
    8005: "PressTheAttack",
    8008: "LethalTempo",
    8021: "FleetFootwork",
    8010: "Conqueror",
    8112: "Electrocute",
    8124: "Predator",
    8128: "DarkHarvest",
    9923: "HailOfBlades",
    8214: "SummonAery",
    8229: "ArcaneComet",
    8230: "PhaseRush",
    8351: "GlacialAugment",
    8360: "UnsealedSpellbook",
    8369: "FirstStrike",
    8437: "GraspOfTheUndying",
    8439: "Aftershock",
    8465: "Guardian",
  };
  return keystoneMap[keystoneId];
};

const MatchCard = ({ matchData, puuid }) => {
  const navigate = useNavigate();
  const { info } = matchData || {};
  const participants = info?.participants || [];
  const [expanded, setExpanded] = React.useState(false);

  const currentPlayer = participants.find((p) => p.puuid === puuid);
  const blueTeam = participants.filter((p) => p.teamId === 100);
  const redTeam = participants.filter((p) => p.teamId === 200);

  const gameDuration = Math.floor((info?.gameDuration || 0) / 60);
  const didWin = currentPlayer?.win;

  //console.log(blueTeam);
  //console.log(info);

  const maxDamage = participants.reduce(
    (max, p) => Math.max(max, p?.totalDamageDealtToChampions || 0),
    1,
  );

  const primaryStyle = currentPlayer?.perks?.styles?.[0];
  const secondaryStyle = currentPlayer?.perks?.styles?.[1];

  const keystoneId = primaryStyle?.selections?.[0]?.perk;
  const primaryTreeId = primaryStyle?.style;
  const secondaryTreeId = secondaryStyle?.style;

  const keystoneName = getKeystoneName(keystoneId);
  const primaryTreeName = getRuneTreeName(primaryTreeId);
  const secondaryTreeName = getRuneTreeName(secondaryTreeId);

  const gameDate = formatDistanceToNow(info?.gameEndTimestamp, {
    addSuffix: true,
  });

  const items = [
    currentPlayer?.item0,
    currentPlayer?.item1,
    currentPlayer?.item2,
    currentPlayer?.item3,
    currentPlayer?.item4,
    currentPlayer?.item5,
  ].filter((id) => id !== 0);

  const clickProfileName = (name) => {
    navigate(`/${encodeURIComponent(name)}`);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (info.gameMode === "CLASSIC") {
    return (
      <Card
        sx={{
          mb: 2,
          bgcolor: "#2a2a2a",
          borderLeft: 4,
          borderColor: didWin ? "#f3c80a" : "#ff6b6b",
          boxShadow: 2,
          maxWidth: 1200,
          width: "70%",
          mx: "auto",
        }}
      >
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box
                component="img"
                src={`/assets/16.1.1/img/champion/${getChampionIconName(
                  currentPlayer?.championName,
                )}.png`}
                alt={currentPlayer?.championName}
                sx={{ width: 48, height: 48, borderRadius: 1 }}
              />
              <Stack spacing={0.5}>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Avatar
                    variant="rounded"
                    src={`/assets/16.1.1/img/spell/${getSummonerSpellName(
                      currentPlayer?.summoner1Id,
                    )}.png`}
                    sx={{ width: 22, height: 22 }}
                  />
                  <Avatar
                    variant="rounded"
                    src={`/assets/16.1.1/img/spell/${getSummonerSpellName(
                      currentPlayer?.summoner2Id,
                    )}.png`}
                    sx={{ width: 22, height: 22 }}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Avatar
                    variant="rounded"
                    src={`/assets/img/perk-images/Styles/${primaryTreeName}/${keystoneName}/${keystoneName}.png`}
                    sx={{ width: 22, height: 22 }}
                  />
                  <Avatar
                    variant="rounded"
                    src={`/assets/img/perk-images/Styles/${getTreeIconName(
                      secondaryTreeId,
                    )}.png`}
                    sx={{ width: 22, height: 22 }}
                  />
                </Box>
              </Stack>
            </Box>

            <Stack spacing={0.5} sx={{ minWidth: 120 }}>
              <Typography variant="h6" sx={{ color: "#f5f5f5" }}>
                {currentPlayer?.kills}/{currentPlayer?.deaths}/
                {currentPlayer?.assists}
              </Typography>
              <Typography variant="body2" sx={{ color: "#cfcfcf" }}>
                {Math.round(
                  ((currentPlayer?.kills + currentPlayer?.assists) /
                    Math.max(currentPlayer?.deaths, 1)) *
                    10,
                ) / 10}{" "}
                KDA
              </Typography>
              <Typography variant="caption" sx={{ color: "#999" }}>
                {currentPlayer.totalMinionsKilled} CS (
                {Math.round(
                  (currentPlayer?.totalMinionsKilled /
                    (info.gameDuration / 60)) *
                    10,
                ) / 10}
                /min)
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 28px)",
                gridTemplateRows: "repeat(2, 28px)",
                gap: 0.5,
              }}
            >
              {items.slice(0, 6).map((itemId, index) => (
                <Avatar
                  key={index}
                  variant="rounded"
                  src={`/assets/16.1.1/img/item/${itemId}.png`}
                  alt={`Item ${itemId}`}
                  sx={{ width: 28, height: 28 }}
                />
              ))}
              {Array.from({ length: 6 - items.length }).map((_, index) => (
                <Box
                  key={`empty-${index}`}
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: "#1a1a1a",
                    borderRadius: 0.5,
                  }}
                />
              ))}
            </Box>

            <Avatar
              variant="rounded"
              src={`/assets/16.1.1/img/item/${currentPlayer?.item6}.png`}
              alt="Trinket"
              sx={{ width: 28, height: 28 }}
            />

            <Stack spacing={0.5} sx={{ textAlign: "right" }}>
              <Chip
                label={didWin ? "Victory" : "Defeat"}
                sx={{
                  bgcolor: didWin ? "#f3c80a" : "#ff6b6b",
                  color: "#1f1f1f",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                }}
                size="small"
              />
              <Typography variant="caption" sx={{ color: "#cfcfcf" }}>
                {gameDuration}m
              </Typography>
              <Typography variant="caption" sx={{ color: "#999" }}>
                {gameDate}
              </Typography>
            </Stack>
            <ExpandMore
              sx={{ color: "white" }}
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                ml: "auto",
              }}
            >
              <Stack spacing={0.5}>
                {blueTeam.map((player, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                  >
                    <Avatar
                      src={`/assets/16.1.1/img/champion/${getChampionIconName(
                        player.championName,
                      )}.png`}
                      alt={player.championName}
                      sx={{ width: 20, height: 20 }}
                    />
                    <Typography
                      onClick={() =>
                        clickProfileName(
                          `${player.riotIdGameName}#${player.riotIdTagline}`,
                        )
                      }
                      variant="caption"
                      sx={{
                        ":hover": { color: "white", cursor: "pointer" },
                        fontSize: 10,
                        maxWidth: 50,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#cfcfcf",
                      }}
                    >
                      {player.riotIdGameName}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Stack spacing={0.5}>
                {redTeam.map((player, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                  >
                    <Avatar
                      src={`/assets/16.1.1/img/champion/${getChampionIconName(
                        player.championName,
                      )}.png`}
                      alt={player.championName}
                      sx={{ width: 20, height: 20 }}
                    />
                    <Typography
                      onClick={() =>
                        clickProfileName(
                          `${player.riotIdGameName}#${player.riotIdTagline}`,
                        )
                      }
                      variant="caption"
                      sx={{
                        ":hover": { color: "white", cursor: "pointer" },
                        fontSize: 10,
                        maxWidth: 50,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#cfcfcf",
                      }}
                    >
                      {player.riotIdGameName}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Stack spacing={0.5}>
              {blueTeam.map((player, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                >
                  <Avatar
                    src={`/assets/16.1.1/img/champion/${getChampionIconName(
                      player.championName,
                    )}.png`}
                    alt={player.championName}
                    sx={{ width: 20, height: 20 }}
                  />
                  <Typography
                    onClick={() =>
                      clickProfileName(
                        `${player.riotIdGameName}#${player.riotIdTagline}`,
                      )
                    }
                    variant="caption"
                    sx={{
                      ":hover": { color: "white", cursor: "pointer" },
                      fontSize: 12,
                      maxWidth: 100,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "#cfcfcf",
                    }}
                  >
                    {player.riotIdGameName}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Stack spacing={0.5}>
              {redTeam.map((player, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Avatar
                    src={`/assets/16.1.1/img/champion/${getChampionIconName(
                      player.championName,
                    )}.png`}
                    alt={player.championName}
                    sx={{ width: 20, height: 20 }}
                  />
                  <Typography
                    onClick={() =>
                      clickProfileName(
                        `${player.riotIdGameName}#${player.riotIdTagline}`,
                      )
                    }
                    variant="caption"
                    sx={{
                      ":hover": { color: "white", cursor: "pointer" },
                      fontSize: 12,
                      maxWidth: 100,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "#cfcfcf",
                    }}
                  >
                    {player.riotIdGameName}
                  </Typography>
                  <Box>
                    <Typography variant="h6" sx={{ color: "#f5f5f5" }}>
                      {player?.kills}/{player?.deaths}/{player?.assists}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#cfcfcf" }}>
                      {Math.round(
                        ((player?.kills + player?.assists) /
                          Math.max(player?.deaths, 1)) *
                          10,
                      ) / 10}{" "}
                      KDA
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#999" }}>
                      {player.totalMinionsKilled} CS
                    </Typography>
                    <Typography sx={{ color: "#999" }}>
                      ({""}
                      {Math.round(
                        (player?.totalMinionsKilled /
                          (info.gameDuration / 60)) *
                          10,
                      ) / 10}
                      /min)
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 28px)",
                      gap: 0.5,
                    }}
                  >
                    {[
                      player.item0,
                      player.item1,
                      player.item2,
                      player.item3,
                      player.item4,
                      player.item5,
                      player.item6,
                    ]
                      .slice(0, 6)
                      .map((itemId, index) => (
                        <Avatar
                          key={index}
                          variant="rounded"
                          src={`/assets/16.1.1/img/item/${itemId}.png`}
                          alt={`Item ${itemId}`}
                          sx={{ width: 28, height: 28 }}
                        />
                      ))}
                    {Array.from({ length: 6 - items.length }).map(
                      (_, index) => (
                        <Box
                          key={`empty-${index}`}
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: "#1a1a1a",
                            borderRadius: 0.5,
                          }}
                        />
                      ),
                    )}
                  </Box>
                  <Stack spacing={0.5}>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Avatar
                        variant="rounded"
                        src={`/assets/16.1.1/img/spell/${getSummonerSpellName(
                          player?.summoner1Id,
                        )}.png`}
                        sx={{ width: 22, height: 22 }}
                      />
                      <Avatar
                        variant="rounded"
                        src={`/assets/16.1.1/img/spell/${getSummonerSpellName(
                          player?.summoner2Id,
                        )}.png`}
                        sx={{ width: 22, height: 22 }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Avatar
                        variant="rounded"
                        src={`/assets/img/perk-images/Styles/${primaryTreeName}/${keystoneName}/${keystoneName}.png`}
                        sx={{ width: 22, height: 22 }}
                      />
                      <Avatar
                        variant="rounded"
                        src={`/assets/img/perk-images/Styles/${getTreeIconName(
                          secondaryTreeId,
                        )}.png`}
                        sx={{ width: 22, height: 22 }}
                      />
                    </Box>
                  </Stack>
                  <Box>
                    <Typography sx={{ color: "#cfcfcf" }}>
                      {Math.round(
                        (player.totalDamageDealtToChampions || 0) / 100,
                      ) / 10}
                      k
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(
                        100,
                        ((player.totalDamageDealtToChampions || 0) /
                          maxDamage) *
                          100,
                      )}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "#444",
                        mt: 1,
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#f3c80a",
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
  if (info.gameMode === "CHERRY") {
    return null;
  }
};

export default MatchCard;
