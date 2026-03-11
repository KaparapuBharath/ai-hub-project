const ChatArea = ({ messages }) => {
  return (
    <div>
      {messages.map((m, i) => (
        <div key={i}>{m.text}</div>
      ))}
    </div>
  );
};

export default ChatArea;
