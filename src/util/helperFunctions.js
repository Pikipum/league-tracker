export const getChampionIconName = (championName) => {
  const nameMap = {
    Wukong: "MonkeyKing",
    "Nunu & Willump": "Nunu",
    LeBlanc: "Leblanc",
    FiddleSticks: "Fiddlesticks"
  };

  return nameMap[championName] || championName;
};
export const getSummonerSpellName = (summonerId) => {
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

export const getRuneTreeName = (treeId) => {
  const treeMap = {
    8000: "Precision",
    8100: "Domination",
    8200: "Sorcery",
    8300: "Inspiration",
    8400: "Resolve",
  };
  return treeMap[treeId];
};

export const getTreeIconName = (treeId, treeName) => {
  const iconMap = {
    8000: "7201_Precision",
    8100: "7200_Domination",
    8200: "7202_Sorcery",
    8300: "7203_Whimsy",
    8400: "7204_Resolve",
  };
  return iconMap[treeId];
};

export const getKeystoneName = (keystoneId) => {
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
    8439: "VeteranAftershock",
    8465: "Guardian",
  };
  return keystoneMap[keystoneId];
};

export const getRegionList = () => {
    return ["EUW", "EUNE", "NA"]
}

export const getRegion = (region) => {
  const regionMap = {
    EUW: "euw1",
    EUNE: "eun1",
    NA: "na1",
  };
  return regionMap[region];
};

export const getRoutingContinent = (region) => {
  const continentMap = {
    euw1: "europe",
    eun1: "europe",
    na1: "americas",
  };
  return continentMap[region];
};
