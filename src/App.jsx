import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileView from "./components/ProfileView";
import LandingPage from "./components/LandingPage";

const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<LandingPage />} />
      <Route exact path="/:name" element={<ProfileView />} />
    </Routes>
  );
};

export default App;
