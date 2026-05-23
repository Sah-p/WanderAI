import { useState, useRef, useEffect } from "react";
import API from "../api";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  /* =========================
     AUTO-SCROLL TO BOTTOM
  ========================= */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  /* =========================
     QUICK SUGGESTIONS
  ========================= */

  const suggestions = [
    "Best beaches in Goa 🏖️",
    "Cheap hotels in Mysore 🏨",
    "Best food in Kerala 🍛",
    "Adventure in Manali 🏔️",
    "Hidden gems in Hampi 🏛️",
    "Budget trip to Jaipur 🏰",
  ];

  /* =========================
     SEND MESSAGE (shared)
  ========================= */

  const sendChatMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessage("");
    setChat((prev) => [...prev, { sender: "user", text: trimmed }]);
    setLoading(true);

    try {
      const response = await API.post("/chat", { message: trimmed });
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: response.data.reply },
      ]);
    } catch (error) {
      console.log(error);
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Sorry, I couldn't get a response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ENTER KEY SUPPORT
  ========================= */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) sendChatMessage(message);
  };

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center py-16 px-6">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl p-10 flex flex-col">

        {/* TITLE */}
        <h1 className="text-5xl font-bold text-center mb-2">
          🤖 WanderAI Assistant
        </h1>
        <p className="text-center text-gray-400 text-xl mb-8">
          Ask me anything about travel in India
        </p>

        {/* CHAT AREA */}
        <div className="bg-slate-50 rounded-3xl p-6 flex-1 min-h-[500px] max-h-[580px] overflow-auto mb-6 space-y-5 border">

          {/* WELCOME MESSAGE */}
          {chat.length === 0 && (
            <div className="flex justify-start">
              <div className="bg-white p-5 rounded-2xl max-w-[75%] text-xl shadow-sm border">
                👋 Hi! I'm WanderAI. Ask me about hotels, food, itineraries,
                hidden spots, budget tips, and more across India!
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-5 rounded-2xl max-w-[75%] text-xl leading-8 ${
                  msg.sender === "user"
                    ? "bg-cyan-500 text-white rounded-br-none"
                    : "bg-white shadow border rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* TYPING INDICATOR */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-5 rounded-2xl shadow border text-xl text-gray-400 rounded-bl-none">
                <span className="animate-pulse">WanderAI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* QUICK SUGGESTIONS */}
        <div className="flex flex-wrap gap-3 mb-5">
          {suggestions.map((item, index) => (
            <button
              key={index}
              onClick={() => sendChatMessage(item)}
              disabled={loading}
              className="bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-700 px-5 py-3 rounded-2xl text-base font-semibold transition disabled:opacity-50"
            >
              {item}
            </button>
          ))}
        </div>

        {/* INPUT ROW */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Ask WanderAI anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 p-5 rounded-2xl border-2 text-xl outline-none focus:border-cyan-400 transition disabled:bg-slate-50"
          />
          <button
            onClick={() => sendChatMessage(message)}
            disabled={loading || !message.trim()}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-10 py-5 rounded-2xl text-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Chatbot;
