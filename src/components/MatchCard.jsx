import { useState, useEffect } from "react";
import axios from "axios";
import ListItem from "@mui/material/ListItem";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { formatDistanceToNow } from "date-fns";

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
    1: "SummonerBoost", // Cleanse
    3: "SummonerExhaust", // Exhaust
    4: "SummonerFlash", // Flash
    6: "SummonerHaste", // Ghost
    7: "SummonerHeal", // Heal
    11: "SummonerSmite", // Smite
    12: "SummonerTeleport", // Teleport
    13: "SummonerMana", // Clarity
    14: "SummonerDot", // Ignite
    21: "SummonerBarrier", // Barrier
    30: "SummonerPoroRecall", // To the King!
    31: "SummonerPoroThrow", // Poro Toss
    32: "SummonerSnowball", // Mark
    39: "SummonerSnowURFSnowball_Mark", // Mark (URF)
    54: "Summoner_UltBookPlaceholder",
    55: "Summoner_UltBookSmitePlaceholder",
    2201: "SummonerCherryHold", // Flee (Arena)
    2202: "SummonerCherryFlash", // Flash (Arena)
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
    // Precision
    8005: "PressTheAttack",
    8008: "LethalTempo",
    8021: "FleetFootwork",
    8010: "Conqueror",

    // Domination
    8112: "Electrocute",
    8124: "Predator",
    8128: "DarkHarvest",
    9923: "HailOfBlades",

    // Sorcery
    8214: "SummonAery",
    8229: "ArcaneComet",
    8230: "PhaseRush",

    // Inspiration
    8351: "GlacialAugment",
    8360: "UnsealedSpellbook",
    8369: "FirstStrike",

    // Resolve
    8437: "GraspOfTheUndying",
    8439: "Aftershock",
    8465: "Guardian",
  };
  return keystoneMap[keystoneId];
};

const MatchCard = ({ matchData, puuid }) => {
  const { info } = matchData || {};
  const participants = info?.participants || [];

  const currentPlayer = participants.find((p) => p.puuid === puuid);
  const blueTeam = participants.filter((p) => p.teamId === 100);
  const redTeam = participants.filter((p) => p.teamId === 200);

  const gameDuration = Math.floor((info?.gameDuration || 0) / 60);
  const didWin = currentPlayer?.win;

  console.log(blueTeam);
  console.log(info);

  const primaryStyle = currentPlayer?.perks?.styles?.[0];
  const secondaryStyle = currentPlayer?.perks?.styles?.[1];

  const keystoneId = primaryStyle?.selections?.[0]?.perk; // Keystone is always first
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

  if (info.gameMode === "CLASSIC") {
    return (
      <div>
        <div>
          <Box
            component="img"
            src={`/assets/16.1.1/img/champion/${getChampionIconName(
              currentPlayer?.championName
            )}.png`}
            alt={currentPlayer?.championName}
            sx={{ width: 48, height: 48 }}
          />
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {items.map((itemId, index) => (
              <Avatar
                key={index}
                variant="rounded"
                src={`/assets/16.1.1/img/item/${itemId}.png`}
                alt={`Item ${itemId}`}
                sx={{ width: 28, height: 28 }}
              />
            ))}
            <Avatar
              variant="rounded"
              src={`/assets/16.1.1/img/item/${currentPlayer?.item6}.png`}
              alt="Trinket"
              sx={{ width: 28, height: 28, ml: 0.5 }}
            />
          </Box>
          <Avatar
            variant="rounded"
            src={`/assets/16.1.1/img/spell/${getSummonerSpellName(
              currentPlayer?.summoner1Id
            )}.png`}
            alt="Trinket"
            sx={{ width: 28, height: 28, ml: 0.5 }}
          />
          <Avatar
            variant="rounded"
            src={`/assets/16.1.1/img/spell/${getSummonerSpellName(
              currentPlayer?.summoner2Id
            )}.png`}
            alt="Trinket"
            sx={{ width: 28, height: 28, ml: 0.5 }}
          />
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Avatar
              variant="rounded"
              src={`/assets/img/perk-images/Styles/${primaryTreeName}/${keystoneName}/${keystoneName}.png`}
              alt="Keystone"
              sx={{ width: 28, height: 28 }}
            />

            <Avatar
              variant="rounded"
              src={`/assets/img/perk-images/Styles/${getTreeIconName(
                secondaryTreeId
              )}.png`}
              alt="Secondary Tree"
              sx={{ width: 28, height: 28 }}
            />
          </Box>
        </div>
        {currentPlayer?.kills}/{currentPlayer?.deaths}/{currentPlayer?.assists}
        {Math.round(
          (currentPlayer?.kills + currentPlayer?.assists) /
            currentPlayer?.deaths
        ) / 10}{" "}
        KDA
        <div>{currentPlayer.totalMinionsKilled}</div>
        <div>Game Duration: {gameDuration}m</div>
        <div>
          {Math.round(
            (currentPlayer?.totalMinionsKilled / (info.gameDuration / 60)) * 10
          ) / 10}{" "}
          CS/Min
        </div>
        <div>{gameDate}</div>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {blueTeam.map((player, index) => (
            <Box key={index} sx={{ textAlign: "center" }}>
              <Avatar
                src={`/assets/16.1.1/img/champion/${getChampionIconName(
                  player.championName
                )}.png`}
                alt={player.championName}
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant="caption" sx={{ fontSize: 10 }}>
                {player.riotIdGameName}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {redTeam.map((player, index) => (
            <Box key={index} sx={{ textAlign: "center" }}>
              <Avatar
                src={`/assets/16.1.1/img/champion/${getChampionIconName(
                  player.championName
                )}.png`}
                alt={player.championName}
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant="caption" sx={{ fontSize: 10 }}>
                {player.riotIdGameName}
              </Typography>
            </Box>
          ))}
        </Box>
      </div>
    );
  }
  if (info.gameMode === "CHERRY") {
    return null;
  }
};

export default MatchCard;
