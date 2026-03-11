import API from "./api";

const register = async (data) => {
  const res = await API.post("/api/auth/register", data);
  return res.data;
};

const login = async (data) => {
  const res = await API.post("/api/auth/login", data);
  return res.data;
};

export default { register, login };