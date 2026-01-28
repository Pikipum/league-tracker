import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import "./LogInButton.css";
import logIn from "./logIn";
import logOut from "./logOut";

const dialogPaperSx = {
  backgroundColor: "#2a2a2a",
  color: "#f5f5f5",
  border: "1px solid #f3c80a",
  boxShadow: "0 10px 22px rgba(0,0,0,0.35)",
};

const fieldSx = {
  "& .MuiInputBase-input": { color: "#f5f5f5" },
  "& .MuiInputLabel-root": { color: "#cfcfcf" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#f3c80a" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#555" },
    "&:hover fieldset": { borderColor: "#f3c80a" },
    "&.Mui-focused fieldset": { borderColor: "#f3c80a" },
  },
};

const LogInButton = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Username is required";
    if (!form.password.trim()) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogOut = () => {
    logOut();
    setHasToken(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError("");
    setLoading(true);
    try {
      await logIn(form);
      setHasToken(true);
      setOpen(false);
    } catch (err) {
      setApiError(
        err.response?.data?.error || "Login failed. Check credentials."
      );
      console.log(apiError)
    } finally {
      setLoading(false);
    }
  };
  if (!hasToken && !loading) {
    return (
      <div>
        <div className="login-button-wrapper">
          <Button
            type="button"
            variant="contained"
            color="primary"
            className="login-button"
            onClick={() => setOpen(true)}
          >
            Log In
          </Button>
        </div>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{ sx: dialogPaperSx }}
        >
          <DialogTitle sx={{ color: "#f3c80a" }}>Log in</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ display: "grid", gap: 2, minWidth: 320 }}>
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                error={Boolean(errors.username)}
                helperText={errors.username}
                autoFocus
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                fullWidth
                sx={fieldSx}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setOpen(false)} sx={{ color: "#f5f5f5" }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#f3c80a",
                  color: "#1f1f1f",
                  "&:hover": { backgroundColor: "#e0b808" },
                  fontWeight: 700,
                }}
              >
                Log In
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
  return (
    <div>
      <div className="login-button-wrapper">
        <Button
          type="button"
          variant="contained"
          color="primary"
          className="login-button"
          onClick={() => handleLogOut()}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default LogInButton;
