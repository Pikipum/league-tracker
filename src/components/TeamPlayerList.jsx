import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { getChampionIconName } from "../util/helperFunctions";
import { DDRAGON_BASE } from "../constants";

const TeamPlayerList = ({ players, onClickPlayer }) => {
  return (
    <Stack spacing={0.5}>
      {players.map((player, index) => (
        <Box
          key={index}
          sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
        >
          <Avatar
            src={`${DDRAGON_BASE}/img/champion/${getChampionIconName(
              player.championName,
            )}.png`}
            alt={player.championName}
            slotProps={{ img: { loading: "lazy" } }}
            sx={{ width: 20, height: 20 }}
          />
          <Typography
            onClick={() =>
              onClickPlayer(
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
              color: "text.secondary",
            }}
          >
            {player.riotIdGameName}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
};

export default TeamPlayerList;
