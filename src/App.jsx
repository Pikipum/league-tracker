import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileView from "./components/ProfileView";
import LandingPage from "./components/LandingPage";
import StatsScraper from "./components/StatsScraper";
import TierList from "./components/TierList";
import ChampionsPage from "./components/ChampionsPage";

const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<LandingPage />} />
      <Route exact path="/:region/:name" element={<ProfileView />} />
      <Route exact path="/:name" element={<ProfileView />} />
      <Route exact path="/stats/:region/:puuid" element={<StatsScraper />} />
      <Route exact path="/champions/:region/:puuid" element={<ChampionsPage />} />
      <Route exact path="/tierlist" element={<TierList />} />
    </Routes>
  );
};

export default App;
