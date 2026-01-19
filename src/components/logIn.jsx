import axios from "axios";

const logIn = async ({ username, password }) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/login`,
    { username, password }
  );
  localStorage.setItem("token", data.token);
  return data; // { token, expiresAt }
};

export default logIn;
