import { useState } from "react";
import Box from "@mui/material/Box";
import FavoriteProfiles from "./FavoriteProfiles";
import SearchBar from "./SearchBar";
import NavigationBar from "./NavigationBar";

const LandingPage = () => {
  const [region, setRegion] = useState("EUW");

  return (
    <Box
      sx={{
        bgcolor: "#1f1f1f",
        minHeight: "100vh",
        px: 2,
        py: 3,
        position: "relative",
      }}
    >
      <NavigationBar sticky showAuthButton />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <SearchBar region={region} setRegion={setRegion} />
        </Box>

        <Box sx={{ width: "100%", maxWidth: 1000, mt: 3 }}>
          <FavoriteProfiles />
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
