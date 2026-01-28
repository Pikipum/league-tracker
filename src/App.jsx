import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileView from "./components/ProfileView";
import LandingPage from "./components/LandingPage";
import StatsScraper from "./components/StatsScraper";
import TierList from "./components/TierList";

const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<LandingPage />} />
      <Route exact path="/:name" element={<ProfileView />} />
      <Route exact path="/stats/:puuid" element={<StatsScraper />} />
      <Route exact path="/tierlist" element={<TierList />} />
    </Routes>
  );
};

export default App;
