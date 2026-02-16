import apiClient from "../util/apiClient";

const createAccount = async ({ username, password }) => {
  const { data } = await apiClient.post("/auth/createaccount", {
    username,
    password,
  });
  localStorage.setItem("token", data.token);
  window.dispatchEvent(new Event("auth:changed"));
  return data; // { token, expiresAt }
};

export default createAccount;
