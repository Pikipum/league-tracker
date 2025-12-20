import SearchBar from "./components/SearchBar";
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileView from "./components/ProfileView";

const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<SearchBar />} />
      <Route exact path="/:name" element={<ProfileView />} />
    </Routes>
  );
};

export default App;
