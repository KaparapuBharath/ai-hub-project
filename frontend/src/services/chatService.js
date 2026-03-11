import API from "./api";

export const sendMessage = async (message) => {
  const res = await API.post("/api/chat", { message });
  return res.data;
};

export const getConversations = async () => {
  const res = await API.get("/api/chat");
  return res.data;
};