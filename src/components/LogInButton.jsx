import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import logIn from "../services/logIn";
import logOut from "../services/logOut";
import createAccount from "../services/createAccount";
import useAuth from "../hooks/useAuth";

const dialogPaperSx = {
  backgroundColor: "#2a2a2a",
  color: "text.primary",
  border: "1px solid #f3c80a",
  boxShadow: "0 10px 22px rgba(0,0,0,0.35)",
};

const fieldSx = {
  "& .MuiInputBase-input": { color: "text.primary" },
  "& .MuiInputLabel-root": { color: "text.secondary" },
  "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#555" },
    "&:hover fieldset": { borderColor: "primary.main" },
    "&.Mui-focused fieldset": { borderColor: "primary.main" },
  },
};

const loginButtonSx = {
  bgcolor: "primary.main",
  color: "#1f1f1f",
  py: "0.5rem",
  px: "1.5rem",
  fontWeight: 700,
  borderRadius: "8px",
  boxShadow: "0 10px 22px rgba(0,0,0,0.25)",
  "&:hover": { bgcolor: "primary.dark" },
};

const LogInButton = () => {
  const [mode, setMode] = useState(null);
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

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
  };

  const validateEmail = (email) => {
    if (!email || !email.trim()) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCreate = async (e) => {
    e?.preventDefault();
    const next = {};
    if (!form.username.trim()) next.username = "Username is required";
    if (!form.password.trim()) next.password = "Password is required";
    if (!validateEmail(form.email)) next.email = "Valid email is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setApiError("");
    setLoading(true);
    try {
      await createAccount({
        username: form.username,
        password: form.password,
        email: form.email,
      });
      setMode(null);
    } catch (err) {
      setApiError(
        err.response?.data?.error ||
          "Account creation failed. Check credentials.",
      );
      console.log(apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError("");
    setLoading(true);
    try {
      await logIn({ username: form.username, password: form.password });
      setMode(null);
    } catch (err) {
      setApiError(
        err.response?.data?.error || "Login failed. Check credentials.",
      );
      console.log(apiError);
    } finally {
      setLoading(false);
    }
  };
  if (!token && !loading) {
    return (
      <div>
        <Box>
          <Button
            type="button"
            variant="contained"
            color="primary"
            sx={loginButtonSx}
            onClick={() => setMode("login")}
          >
            Log In
          </Button>
        </Box>

        <Dialog
          open={mode === "login"}
          onClose={() => setMode(null)}
          PaperProps={{ sx: dialogPaperSx }}
        >
          <DialogTitle sx={{ color: "primary.main" }}>Log in</DialogTitle>
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
              <Button onClick={() => setMode(null)} sx={{ color: "text.primary" }}>
                Cancel
              </Button>
              <Button
                onClick={() => setMode("create")}
                sx={{ color: "text.primary" }}
              >
                Create account
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "primary.main",
                  color: "#1f1f1f",
                  "&:hover": { backgroundColor: "primary.dark" },
                  fontWeight: 700,
                }}
              >
                Log In
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          open={mode === "create"}
          onClose={() => setMode(null)}
          PaperProps={{ sx: dialogPaperSx }}
        >
          <DialogTitle sx={{ color: "primary.main" }}>Create account</DialogTitle>
          <form onSubmit={handleCreate}>
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
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
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
              <Button onClick={() => setMode(null)} sx={{ color: "text.primary" }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "primary.main",
                  color: "#1f1f1f",
                  "&:hover": { backgroundColor: "primary.dark" },
                  fontWeight: 700,
                }}
              >
                Create
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
  return (
    <div>
      <Box>
        <Button
          type="button"
          variant="contained"
          color="primary"
          sx={loginButtonSx}
          onClick={() => handleLogOut()}
        >
          Log Out
        </Button>
      </Box>
    </div>
  );
};

export default LogInButton;
