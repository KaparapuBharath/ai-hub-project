import { useState, useRef, useEffect } from "react";
import { LayoutGrid, Trash2 } from "lucide-react";

export default function Workspace() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCloud, setShowCloud] = useState(false);
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const gridRef = useRef(null);
  const cloudRef = useRef(null);

  const [cloudPos, setCloudPos] = useState({ top: 0, left: 0 });

  const getSettings = () => {
    const saved = localStorage.getItem("aihub_settings");
    return saved ? JSON.parse(saved) : {};
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const toggleCloud = (e) => {

    e.preventDefault();
    e.stopPropagation();

    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();

      setCloudPos({
        top: rect.top,
        left: rect.right + 12
      });
    }

    setShowCloud(prev => !prev);
  };

  const deleteHistoryItem = (index) => {

    const updated = history.filter((_, i) => i !== index);

    setHistory(updated);
    localStorage.setItem("aihub_history", JSON.stringify(updated));
  };

  const clearAllChats = () => {

    setMessages([]);
    setHistory([]);
    localStorage.removeItem("aihub_history");
  };

  const sendMessage = async () => {

    if (!input.trim() || loading) return;

    const settings = getSettings();

    const updatedMessages = [
      ...messages,
      { role: "user", content: input, time: new Date() }
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: updatedMessages,
          temperature: settings.temperature || 0.7,
          length: settings.length || "medium"
        })
      });

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.message?.content || "No response from AI.",
          time: new Date()
        }
      ]);

      const updatedHistory = [
        updatedMessages[updatedMessages.length - 1].content,
        ...history
      ];

      setHistory(updatedHistory);
      localStorage.setItem("aihub_history", JSON.stringify(updatedHistory));

    } catch {

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Server error. Please try again.",
          time: new Date()
        }
      ]);

    }

    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    autoResize();
  }, [input]);

  useEffect(() => {
    const saved = localStorage.getItem("aihub_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  /* close cloud when clicking outside */
  useEffect(() => {

    const handler = (e) => {
      if (
        cloudRef.current &&
        !cloudRef.current.contains(e.target) &&
        !gridRef.current.contains(e.target)
      ) {
        setShowCloud(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);

  }, []);

  const settings = getSettings();

  return (

    <div className="flex w-full text-white relative">

      <div className="flex flex-col flex-1">

        {/* Workspace Header */}
        <div className="px-10 pt-6">

          <button
            type="button"
            ref={gridRef}
            onClick={toggleCloud}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <LayoutGrid size={20} />
          </button>

        </div>

        {/* Chat Messages */}
        <div className="px-10 pt-6 pb-40 space-y-8">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >

              <div
                className={`max-w-[60%] px-6 py-4 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-white/5"
                }`}
              >

                {msg.content}

                {settings.showTimestamp && (
                  <div className="text-xs text-white/40 mt-2">
                    {new Date(msg.time).toLocaleTimeString()}
                  </div>
                )}

              </div>

            </div>

          ))}

          {loading && (
            <div className="text-white/40 text-sm">
              AI is typing...
            </div>
          )}

          <div ref={messagesEndRef} />

        </div>

      </div>

      {/* Floating Cloud */}
      {showCloud && (

        <div
          ref={cloudRef}
          style={{ top: cloudPos.top, left: cloudPos.left }}
          className="fixed w-72 bg-[#0f172a] border border-white/10 rounded-2xl p-5 shadow-2xl z-50"
        >

          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setShowCloud(false);
            }}
            className="w-full mb-4 bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-xl font-semibold"
          >
            + New Chat
          </button>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full mb-4 px-3 py-2 rounded-lg bg-white/5 outline-none text-sm"
          />

          <div className="space-y-2 max-h-40 overflow-y-auto">

            {history
              .filter(item =>
                String(item).toLowerCase().includes(search.toLowerCase())
              )
              .map((item, i) => (

                <div
                  key={i}
                  className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg text-sm text-white/70"
                >

                  <span className="truncate">{String(item)}</span>

                  <Trash2
                    size={14}
                    className="cursor-pointer hover:text-red-400"
                    onClick={() => deleteHistoryItem(i)}
                  />

                </div>

              ))}

            {history.length === 0 && (
              <div className="text-sm text-white/30">
                No conversations yet
              </div>
            )}

          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={clearAllChats}
              className="mt-4 text-xs text-red-400 hover:text-red-300"
            >
              Delete all chats
            </button>
          )}

        </div>

      )}

      {/* Floating Chat Input */}
      <div className="fixed bottom-6 left-[320px] right-10">

        <div className="flex gap-4 bg-white/5 rounded-2xl p-3 backdrop-blur">

          <textarea
            ref={textareaRef}
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 resize-none bg-transparent outline-none px-3 py-2 max-h-40"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold disabled:opacity-50"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}