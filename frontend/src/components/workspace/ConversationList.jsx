const ConversationList = ({ list }) => {
  return (
    <div>
      {list.map((c, i) => (
        <div key={i}>{c.title}</div>
      ))}
    </div>
  );
};

export default ConversationList;
