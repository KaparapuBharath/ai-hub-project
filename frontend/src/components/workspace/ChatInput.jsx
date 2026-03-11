import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [msg, setMsg] = useState("");

  return (
    <div>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={() => onSend(msg)}>Send</button>
    </div>
  );
};

export default ChatInput;
