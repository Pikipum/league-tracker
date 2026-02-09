import { useState } from "react";
import Box from "@mui/material/Box";
import SearchBar from "./SearchBar";
import NavigationBar from "./NavigationBar";
import LogInButton from "./LogInButton";

const PageLayout = ({ children, region, setRegion, navBarProps = {} }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <Box
      sx={{
        bgcolor: "#1f1f1f",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        px: 2,
        py: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            flex: 1,
            minWidth: 0,
          }}
        >
          <NavigationBar
            {...navBarProps}
            searchOpen={searchOpen}
            onSearchToggle={() => setSearchOpen((v) => !v)}
            sx={{ order: { xs: 0, sm: 1 } }}
          />
          <Box
            sx={{
              order: { xs: 1, sm: 0 },
              width: "100%",
              display: {
                xs: searchOpen ? "flex" : "none",
                sm: "flex",
              },
              justifyContent: "flex-start",
            }}
          >
            <SearchBar region={region} setRegion={setRegion} />
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <LogInButton />
        </Box>
      </Box>
      {children}
    </Box>
  );
};

export default PageLayout;
