import LogInButton from "./LogInButton";
import SearchBar from "./SearchBar";

const LandingPage = () => {
  return (
    <div>
      <div className="search-bar-container">
        <SearchBar />
      </div>
      <LogInButton />
    </div>
  );
};

export default LandingPage;
