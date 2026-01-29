import axios from "axios";

const createAccount = async ({ username, password }) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/createaccount`,
    { username, password },
  );
  localStorage.setItem("token", data.token);
  window.dispatchEvent(new Event("auth:changed"));
  return data; // { token, expiresAt }
};

export default createAccount;
