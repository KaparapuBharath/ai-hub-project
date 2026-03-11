import API from "./api";

export const getUsage = async () => {
  const { data } = await API.get("/usage");
  return data;
};