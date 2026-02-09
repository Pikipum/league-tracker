export const tagSplitter = (identifier) => {
  if (!identifier)
    return {
      summonerName: "",
      tag: "",
      isValid: false,
      error: "No search query provided.",
    };

  const trimmed = identifier.trim();
  if (!trimmed.includes("#")) {
    return {
      summonerName: "",
      tag: "",
      isValid: false,
      error: "Invalid format. Please use: SummonerName#TAG",
    };
  }

  const [summonerName = "", tag = ""] = trimmed.split("#", 2);

  if (!summonerName.trim()) {
    return {
      summonerName: "",
      tag: "",
      isValid: false,
      error: "Summoner name is missing. Please use: SummonerName#TAG",
    };
  }

  if (!tag.trim()) {
    return {
      summonerName: "",
      tag: "",
      isValid: false,
      error: "Tag is missing. Please use: SummonerName#TAG",
    };
  }

  return {
    summonerName: summonerName.trim(),
    tag: tag.trim(),
    isValid: true,
    error: null,
  };
};
