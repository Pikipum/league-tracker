import { Button } from "@mui/material";
import "./LogInButton.css";

const LogInButton = ({ onClick }) => {
  return (
    <div className="login-button-wrapper">
      <Button
        type="button"
        variant="contained"
        color="primary"
        className="login-button"
        onClick={onClick}
      >
        Log In
      </Button>
    </div>
  );
};

export default LogInButton;
