import API from "./api";

export const sendMessage = async (message) => {
  const res = await API.post("/chat", { message });
  return res.data;
};

export const getConversations = async () => {
  const res = await API.get("/chat");
  return res.data;
};