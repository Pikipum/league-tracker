import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const logOut = async () => {
  const token = localStorage.getItem("token");
  try {
    if (token) {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    }
  } catch (e) {
    console.warn("logout request failed", e);
  }

  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth:changed"));
};

export default logOut;
