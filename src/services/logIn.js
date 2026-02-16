import apiClient from "../util/apiClient";

const logIn = async ({ username, password }) => {
  const { data } = await apiClient.post("/auth/login", { username, password });
  localStorage.setItem("token", data.token);
  window.dispatchEvent(new Event("auth:changed"));
  return data; // { token, expiresAt }
};

export default logIn;
