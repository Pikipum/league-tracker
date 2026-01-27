import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import QueueSelect from "./QueueSelect";
import RecentlyPlayedTopBar from "./RecentlyPlayedTopBar";

const MatchHistoryTopCard = ({ puuid, matchHistory, queueType, setQueueType }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        bgcolor: "#2a2a2a",
        boxShadow: 2,
        maxWidth: 1200,
        width: "70%",
        mx: "auto",
        borderRadius: 1
      }}
    >
      <QueueSelect queueType={queueType} setQueueType={setQueueType} />
      <RecentlyPlayedTopBar puuid={puuid} matchHistory={matchHistory} />
      <Typography>Search for champion</Typography>
    </Box>
  );
};

export default MatchHistoryTopCard;
