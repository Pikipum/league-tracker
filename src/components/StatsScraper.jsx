import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, LinearProgress, Button } from "@mui/material";
import LoadingCircle from "./LoadingCircle";
import PageLayout from "./PageLayout";
import apiClient from "../util/apiClient";
import { getRegion } from "../util/helperFunctions";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const StatsScraper = () => {
  const statusRef = useRef(null);
  const { puuid, region: urlRegion } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [region, setRegion] = useState(urlRegion || "EUW");
  const [profileData, setProfileData] = useState();
  const [matchIdsScraped, setMatchIdsScraped] = useState(0);
  const [matchesScraped, setMatchesScraped] = useState(0);
  const [totalMatchIds, setTotalMatchIds] = useState(0);
  const [status, setStatus] = useState("");
  const abortRef = useRef(false);
  const platformRegion = getRegion(region);

  statusRef.current = setStatus;

  const countdown = async (totalMs, messagePrefix) => {
    const endTime = Date.now() + totalMs;
    while (Date.now() < endTime) {
      if (abortRef.current) break;
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      statusRef.current(`${messagePrefix} ${remaining}s...`);
      await sleep(1000);
    }
  };

  useEffect(() => {
    if (!puuid) return;
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `/profile/account/by-puuid/${puuid}`,
        );
        setProfileData(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [puuid]);

  const fetchWithRateLimit = async (fetchFn, maxRetries = 10) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (abortRef.current) return null;
      try {
        return await fetchFn();
      } catch (error) {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers["retry-after"];
          const waitTime = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : Math.min(1000 * Math.pow(2, attempt), 120000);
          await countdown(waitTime, "Rate limited. Retrying in");
        } else if (attempt === maxRetries - 1) {
          throw error;
        } else {
          await sleep(1000 * (attempt + 1));
        }
      }
    }
    return null;
  };

  const scrapeAllMatchIds = async () => {
    const allMatchIds = [];
    let start = 0;
    const count = 100;
    let requestCount = 0;
    const requestTimes = [];
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 5;
    setStatus("Scraping match IDs...");

    while (true) {
      if (abortRef.current) break;

      if (consecutiveErrors >= maxConsecutiveErrors) {
        setStatus(
          `Too many errors. Stopped at ${allMatchIds.length} match IDs.`,
        );
        break;
      }

      const now = Date.now();

      while (requestTimes.length > 0 && now - requestTimes[0] > 120000) {
        requestTimes.shift();
      }

      if (requestTimes.length >= 95) {
        const waitTime = 120000 - (now - requestTimes[0]) + 1000;
        await countdown(waitTime, "Approaching 2-min rate limit. Waiting");
        continue;
      }

      await sleep(50);

      try {
        const currentStart = start;

        const response = await fetchWithRateLimit(() =>
          apiClient.get(`/matches/ids/${puuid}`, {
            params: { queue: 420, start: currentStart, count, region: platformRegion },
          }),
        );

        if (!response) {
          consecutiveErrors++;
          await sleep(2000);
          continue;
        }

        consecutiveErrors = 0;
        requestTimes.push(Date.now());
        requestCount++;

        const matchIds = response.data;

        if (!Array.isArray(matchIds) || matchIds.length === 0) {
          setStatus(`All match IDs scraped! Total: ${allMatchIds.length}`);
          break;
        }

        allMatchIds.push(...matchIds);
        setMatchIdsScraped(allMatchIds.length);
        start += count;

        setStatus(
          `Scraping match IDs... (${allMatchIds.length} IDs, batch ${requestCount})`,
        );
      } catch (error) {
        console.error("Error fetching match IDs:", error);
        consecutiveErrors++;
        setStatus(
          `Error fetching batch ${requestCount + 1}, retrying... (${consecutiveErrors}/${maxConsecutiveErrors})`,
        );
        await sleep(2000 * consecutiveErrors);
      }
    }

    return allMatchIds;
  };

  const scrapeMatches = async (matchIds) => {
    const requestTimes = [];
    let scraped = 0;

    setStatus("Scraping match details...");
    setTotalMatchIds(matchIds.length);

    for (const matchId of matchIds) {
      if (abortRef.current) break;

      const now = Date.now();

      while (requestTimes.length > 0 && now - requestTimes[0] > 120000) {
        requestTimes.shift();
      }

      if (requestTimes.length >= 95) {
        const waitTime = 120000 - (now - requestTimes[0]) + 1000;
        await countdown(waitTime, "Approaching 2-min rate limit. Waiting");
        continue;
      }

      await sleep(50);

      try {
        await fetchWithRateLimit(() =>
          apiClient.get(`/matches/${matchId}`, { params: { region: platformRegion }}),
        );

        requestTimes.push(Date.now());
        scraped++;
        setMatchesScraped(scraped);
        setStatus(`Scraping match ${scraped}/${matchIds.length}...`);
      } catch (error) {
        console.error(`Error fetching match ${matchId}:`, error);
        scraped++;
        setMatchesScraped(scraped);
      }
    }

    setStatus("Scraping complete!");
  };

  const handleClick = async () => {
    if (isScraping) {
      abortRef.current = true;
      setStatus("Aborting...");
      return;
    }

    abortRef.current = false;
    setIsScraping(true);
    setMatchIdsScraped(0);
    setMatchesScraped(0);
    setTotalMatchIds(0);

    try {
      const matchIds = await scrapeAllMatchIds();

      if (abortRef.current) {
        setStatus("Aborted.");
        setIsScraping(false);
        return;
      }

      if (matchIds.length > 0) {
        await scrapeMatches(matchIds);
      }
    } catch (error) {
      console.error("Scraping error:", error);
      setStatus("Error occurred during scraping.");
    } finally {
      setIsScraping(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingCircle />
      </Box>
    );
  }

  const matchProgress =
    totalMatchIds > 0 ? (matchesScraped / totalMatchIds) * 100 : 0;

  return (
    <PageLayout
      region={region}
      setRegion={setRegion}
      navBarProps={{
        puuid,
        gameName: profileData?.gameName,
        tagLine: profileData?.tagLine,
        region,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 3,
        }}
      >
        <Button
          type="button"
          variant="contained"
          onClick={handleClick}
          sx={{
            minWidth: 300,
            bgcolor: isScraping ? "error.light" : "primary.main",
            color: "#1f1f1f",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: isScraping ? "#ff5252" : "primary.dark",
            },
          }}
        >
          {isScraping
            ? "Stop Scraping"
            : `Scrape data for ${profileData?.gameName} #${profileData?.tagLine}`}
        </Button>

        {isScraping && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <LoadingCircle />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            minWidth: 400,
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Match IDs scraped: {matchIdsScraped}
          </Typography>

          <Typography variant="h6" sx={{ color: "#fff" }}>
            Matches scraped: {matchesScraped}
            {totalMatchIds > 0 && ` / ${totalMatchIds}`}
          </Typography>

          {totalMatchIds > 0 && (
            <Box sx={{ width: "100%", mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={matchProgress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: "#333",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#c8aa6e",
                  },
                }}
              />
            </Box>
          )}

          {status && (
            <Typography variant="body1" sx={{ color: "#aaa", mt: 1 }}>
              {status}
            </Typography>
          )}
        </Box>
      </Box>
    </PageLayout>
  );
};

export default StatsScraper;
