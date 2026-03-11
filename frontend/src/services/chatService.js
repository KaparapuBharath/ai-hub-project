import api from "./api";

export const sendMessage = async (message) => {
  const res = await api.post("/chat", { message });
  return res.data;
};

export const getConversations = async () => {
  const res = await api.get("/chat");
  return res.data;
};
