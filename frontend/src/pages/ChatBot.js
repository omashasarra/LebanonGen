import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Send, Bot, ShieldAlert, Info, X } from "lucide-react";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cb-body {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #fafaf9;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
  }

  @keyframes cb-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cb-pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.4; transform:scale(.6); }
  }
  @keyframes cb-bounce {
    0%,80%,100% { transform: scaleY(0.4); }
    40%         { transform: scaleY(1.0); }
  }
  @keyframes cb-msgIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cb-pulse   { animation: cb-pulse-dot 2.2s infinite; }
  .cb-fade-up { animation: cb-fadeUp 0.45s ease both; }
  .cb-msg-in  { animation: cb-msgIn 0.3s ease both; }

  /* ── Outer shell ── */
  .cb-shell {
    width: 100%;
    max-width: 680px;
    height: 88vh;
    max-height: 820px;
    background: #fff;
    border-radius: 24px;
    border: 1px solid #f0e8e8;
    box-shadow: 0 16px 64px rgba(127,29,29,0.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: cb-fadeUp 0.5s ease both;
  }

  /* ── Header ── */
  .cb-header {
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }
  .cb-avatar {
    width: 46px; height: 46px; border-radius: 13px;
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; position: relative;
  }
  .cb-online-dot {
    position: absolute; bottom: -2px; right: -2px;
    width: 12px; height: 12px; border-radius: 50%;
    background: #4ade80; border: 2px solid #991b1b;
  }

  /* ── Suggested prompts ── */
  .cb-suggestions {
    display: flex; flex-wrap: wrap; gap: 8px;
    padding: 14px 20px 4px;
    flex-shrink: 0;
  }
  .cb-chip {
    background: #fdf5f5; border: 1px solid #fca5a5;
    color: #7f1d1d; font-size: 12px; font-weight: 500;
    padding: 6px 12px; border-radius: 999px; cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .cb-chip:hover { background: #fee2e2; border-color: #f87171; }

  /* ── Messages area ── */
  .cb-messages {
    flex: 1; overflow-y: auto;
    padding: 20px;
    display: flex; flex-direction: column; gap: 16px;
    scroll-behavior: smooth;
  }
  .cb-messages::-webkit-scrollbar { width: 4px; }
  .cb-messages::-webkit-scrollbar-track { background: transparent; }
  .cb-messages::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }

  /* ── Message bubbles ── */
  .cb-bubble-bot {
    max-width: 82%;
    background: #fafaf9;
    border: 1px solid #f0e8e8;
    border-radius: 18px 18px 18px 4px;
    padding: 14px 16px;
    color: #1f2937;
  }
  .cb-bubble-user {
    max-width: 82%;
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    border-radius: 18px 18px 4px 18px;
    padding: 14px 16px;
    color: #fff;
    margin-left: auto;
  }
  .cb-bubble-bot .prose { font-size: 14px; line-height: 1.65; }
  .cb-bubble-user .prose { font-size: 14px; line-height: 1.65; }

  /* Typing indicator */
  .cb-typing {
    display: flex; align-items: center; gap: 4px;
    padding: 14px 16px;
    background: #fafaf9; border: 1px solid #f0e8e8;
    border-radius: 18px 18px 18px 4px;
    width: fit-content;
  }
  .cb-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #b91c1c;
    animation: cb-bounce 1.4s ease infinite;
  }
  .cb-dot:nth-child(2) { animation-delay: 0.16s; }
  .cb-dot:nth-child(3) { animation-delay: 0.32s; }

  /* ── Footer ── */
  .cb-footer {
    padding: 14px 20px 18px;
    background: #fafaf9;
    border-top: 1px solid #f0e8e8;
    flex-shrink: 0;
  }
  .cb-disclaimer {
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 12px; padding: 0 2px;
  }
  .cb-input-row {
    display: flex; gap: 10px; align-items: center;
  }
  .cb-input {
    flex: 1; background: #fff; border: 1px solid #e5e7eb;
    border-radius: 12px; padding: 12px 16px;
    font-size: 14px; font-family: 'Inter', sans-serif; color: #111827;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .cb-input::placeholder { color: #9ca3af; }
  .cb-input:focus {
    border-color: #b91c1c;
    box-shadow: 0 0 0 3px rgba(185,28,28,0.08);
  }
  .cb-send {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg, #7f1d1d, #991b1b);
    border: none; cursor: pointer; color: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(127,29,29,0.3);
    transition: opacity 0.2s, transform 0.15s;
    flex-shrink: 0;
  }
  .cb-send:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .cb-send:active { transform: scale(0.95); }
  .cb-send:disabled { background: #d1d5db; box-shadow: none; cursor: not-allowed; }

  /* ── Info tooltip overlay ── */
  .cb-info-overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(127,29,29,0.97);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 32px; text-align: center; z-index: 10;
    border-radius: 24px;
  }

  @media (max-width: 480px) {
    .cb-shell { height: 100vh; max-height: 100vh; border-radius: 0; }
    .cb-body { padding: 0; align-items: stretch; }
  }
`;

const SUGGESTIONS = [
  "What does AA genotype mean?",
  "Is AS carrier dangerous?",
  "What are sickle cell symptoms?",
  "How accurate is this assessment?",
];

function ChatBot() {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") navigate("/login");
  }, [navigate]);

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
  const coupleId = localStorage.getItem("coupleID");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;
    const userMsg = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ai/chat`,
        { coupleId, message: text },
      );
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
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Service temporarily unavailable. Please try again.",
          time: "Error",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <style>{injectStyles}</style>
      <div className="cb-body">
        <div className="cb-shell" style={{ position: "relative" }}>
          {/* Info overlay */}
          {showInfo && (
            <div className="cb-info-overlay">
              <button
                onClick={() => setShowInfo(false)}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#fff",
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={16} />
              </button>
              <div style={{ fontSize: 36, marginBottom: 16 }}>🧬</div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 12px",
                }}
              >
                About this Counselor
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 14,
                  lineHeight: 1.7,
                  maxWidth: 360,
                }}
              >
                This AI assistant is trained on sickle cell disease genetics and
                is aware of your submitted couple profile. It provides
                educational guidance only. Always consult a licensed genetic
                counselor or physician for clinical decisions.
              </p>
            </div>
          )}

          {/* ── Header ── */}
          <div className="cb-header">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div className="cb-avatar">
                <Bot size={22} color="#fff" />
                <div className="cb-online-dot" />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 2,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Genetic Counselor
                  </h2>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 999,
                      padding: "2px 8px",
                    }}
                  >
                    <span
                      className="cb-pulse"
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#4ade80",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        color: "rgba(255,255,255,0.8)",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Online
                    </span>
                  </div>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: 300,
                  }}
                >
                  Lebanon Gene · AI System
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(true)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                width: 36,
                height: 36,
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.18)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
            >
              <Info size={16} />
            </button>
          </div>

          {/* ── Suggested prompts ── */}
          {messages.length <= 1 && (
            <div className="cb-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="cb-chip"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* ── Messages ── */}
          <div className="cb-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`cb-msg-in`}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.sender === "bot" && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#fdf5f5",
                      border: "1px solid #fca5a5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
                      flexShrink: 0,
                      alignSelf: "flex-end",
                    }}
                  >
                    <Bot size={14} color="#7f1d1d" />
                  </div>
                )}
                <div
                  className={
                    msg.sender === "user" ? "cb-bubble-user" : "cb-bubble-bot"
                  }
                >
                  <div className="prose">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  <span
                    style={{
                      display: "block",
                      fontSize: 10,
                      marginTop: 6,
                      opacity: 0.45,
                      textAlign: msg.sender === "user" ? "right" : "left",
                      fontWeight: 600,
                    }}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#fdf5f5",
                    border: "1px solid #fca5a5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={14} color="#7f1d1d" />
                </div>
                <div className="cb-typing">
                  <div className="cb-dot" />
                  <div className="cb-dot" />
                  <div className="cb-dot" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ── Footer ── */}
          <div className="cb-footer">
            <div className="cb-disclaimer">
              <ShieldAlert size={13} color="#b91c1c" />
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}
              >
                Educational guidance only · Not a substitute for medical advice
              </p>
            </div>
            <form onSubmit={handleSend} className="cb-input-row">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about genotypes, risk levels, sickle cell…"
                className="cb-input"
              />
              <button
                type="submit"
                className="cb-send"
                disabled={!input.trim() || isTyping}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatBot;
