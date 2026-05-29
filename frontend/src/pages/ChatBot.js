import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Send, Bot, User, ShieldAlert, Info } from "lucide-react";

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your **LebanonGen Assistant**. I've reviewed your genetic profiles. How can I help clarify your results today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const coupleId = localStorage.getItem("coupleId");

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ai/chat`, {
        coupleId,
        message: input,
      });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.reply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Service unavailable.", time: "Error" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-lg h-[700px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-[#b30000] p-6 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-4">
            <div className="relative p-2 bg-white/20 rounded-2xl">
              <Bot size={32} />
              <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 border-2 border-[#b30000] rounded-full"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Genetic Counselor
              </h2>
              <p className="text-xs opacity-90 font-medium">
                LebanonGen AI System
              </p>
            </div>
          </div>
          <Info
            size={22}
            className="opacity-80 hover:opacity-100 cursor-pointer"
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-2xl shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#b30000] text-white rounded-br-none"
                    : "bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-none"
                }`}
              >
                {/* Markdown Rendering */}
                <div className="text-sm prose prose-sm prose-slate max-w-none break-words">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <span
                  className={`block text-[10px] mt-2 opacity-50 font-bold ${msg.sender === "user" ? "text-right" : "text-left"}`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 animate-pulse text-xs text-gray-400">
                Assistant is analyzing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Footer/Input */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
          <div className="mb-3 flex items-center gap-2 px-2">
            <ShieldAlert size={14} className="text-red-600" />
            <p className="text-[10px] text-gray-500 font-medium italic">
              Educational guidance only. Consult a doctor.
            </p>
          </div>
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your genotypes..."
              className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#b30000]/10 focus:border-[#b30000] outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-[#b30000] text-white p-3.5 rounded-2xl hover:bg-[#900000] transition-all shadow-lg active:scale-95 disabled:bg-gray-300"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
