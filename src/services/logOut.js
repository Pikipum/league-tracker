import apiClient from "../util/apiClient";

const logOut = async () => {
  const token = localStorage.getItem("token");
  try {
    if (token) {
      await apiClient.post(
        "/auth/logout",
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
